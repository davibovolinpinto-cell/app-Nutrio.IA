import { NextRequest, NextResponse } from 'next/server'

// Função auxiliar para aguardar um tempo
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Função para fazer requisição com retry
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      
      // Se não for erro 429, retorna a resposta
      if (response.status !== 429) {
        return response
      }
      
      // Se for 429 e ainda temos tentativas, aguarda e tenta novamente
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000 // Backoff exponencial: 1s, 2s, 4s
        console.log(`Rate limit atingido. Aguardando ${waitTime}ms antes de tentar novamente...`)
        await wait(waitTime)
        continue
      }
      
      // Se for a última tentativa, retorna o erro 429
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Erro desconhecido')
      
      // Se ainda temos tentativas, aguarda e tenta novamente
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`Erro na requisição. Tentando novamente em ${waitTime}ms...`)
        await wait(waitTime)
        continue
      }
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  throw lastError || new Error('Falha após múltiplas tentativas')
}

export async function POST(request: NextRequest) {
  try {
    const { image, includeMicronutrients = false } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    // Verificar se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API Key da OpenAI não configurada' },
        { status: 500 }
      )
    }

    // Prompt adaptado baseado no plano do usuário
    const systemPrompt = `Você é um nutricionista especializado em análise de refeições por imagem. Sua tarefa é:

1. Identificar TODOS os alimentos visíveis na imagem com precisão
2. Estimar porções realistas baseadas no tamanho visual dos alimentos
3. Calcular valores nutricionais precisos (calorias, proteínas, carboidratos, gorduras)
4. ${includeMicronutrients ? 'Calcular micronutrientes detalhados (vitaminas A, C, D, cálcio, ferro, fibras)' : ''}
5. Ser detalhado e específico na identificação dos alimentos
6. Considerar preparações e métodos de cozimento visíveis

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem texto adicional antes ou depois.

Formato obrigatório:
{
  "foods": [
    {
      "name": "Nome específico do alimento",
      "portion": "Porção estimada (ex: 200g, 1 unidade média, 1 xícara)",
      "calories": número_inteiro,
      "protein": número_decimal_2_casas,
      "carbs": número_decimal_2_casas,
      "fat": número_decimal_2_casas
    }
  ],
  "totals": {
    "calories": número_inteiro,
    "protein": número_decimal_2_casas,
    "carbs": número_decimal_2_casas,
    "fat": número_decimal_2_casas
  },
  ${includeMicronutrients ? `"micronutrients": {
    "vitaminA": número_decimal_2_casas,
    "vitaminC": número_decimal_2_casas,
    "vitaminD": número_decimal_2_casas,
    "calcium": número_decimal_2_casas,
    "iron": número_decimal_2_casas,
    "fiber": número_decimal_2_casas
  },` : ''}
  "notes": "Observações sobre a análise (opcional)"
}`

    // Chamar OpenAI Vision API com retry automático
    const response = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta refeição e identifique todos os alimentos visíveis com suas porções e valores nutricionais. Seja preciso e detalhado.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    }, 3) // 3 tentativas com backoff exponencial

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erro da OpenAI:', errorData)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API Key inválida ou não autorizada. Configure sua chave da OpenAI.' },
          { status: 500 }
        )
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'O serviço está temporariamente ocupado. Por favor, aguarde 30 segundos e tente novamente.' },
          { status: 429 }
        )
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.' },
          { status: 400 }
        )
      }
      
      throw new Error(`Erro ${response.status}: ${errorData.error?.message || 'Erro ao analisar imagem'}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.')
    }
    
    const content = data.choices[0].message.content

    // Parse do JSON retornado pela IA
    let result
    try {
      let cleanContent = content.trim()
      
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
      }
      
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }
      
      result = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', content)
      throw new Error('Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.')
    }

    // Validar estrutura do resultado
    if (!result.foods || !Array.isArray(result.foods) || result.foods.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.' },
        { status: 400 }
      )
    }

    // Garantir valores com 2 casas decimais
    result.foods = result.foods.map((food: any) => ({
      name: food.name || 'Alimento não identificado',
      portion: food.portion || 'Porção não especificada',
      calories: Math.round(Number(food.calories) || 0),
      protein: Number((Number(food.protein) || 0).toFixed(2)),
      carbs: Number((Number(food.carbs) || 0).toFixed(2)),
      fat: Number((Number(food.fat) || 0).toFixed(2)),
    }))

    // Calcular totais
    result.totals = {
      calories: Math.round(result.foods.reduce((sum: number, food: any) => sum + (food.calories || 0), 0)),
      protein: Number(result.foods.reduce((sum: number, food: any) => sum + (food.protein || 0), 0).toFixed(2)),
      carbs: Number(result.foods.reduce((sum: number, food: any) => sum + (food.carbs || 0), 0).toFixed(2)),
      fat: Number(result.foods.reduce((sum: number, food: any) => sum + (food.fat || 0), 0).toFixed(2)),
    }

    // Processar micronutrientes se incluídos
    if (includeMicronutrients && result.micronutrients) {
      result.micronutrients = {
        vitaminA: Number((Number(result.micronutrients.vitaminA) || 0).toFixed(2)),
        vitaminC: Number((Number(result.micronutrients.vitaminC) || 0).toFixed(2)),
        vitaminD: Number((Number(result.micronutrients.vitaminD) || 0).toFixed(2)),
        calcium: Number((Number(result.micronutrients.calcium) || 0).toFixed(2)),
        iron: Number((Number(result.micronutrients.iron) || 0).toFixed(2)),
        fiber: Number((Number(result.micronutrients.fiber) || 0).toFixed(2)),
      }
    }

    if (!result.notes) {
      result.notes = `Análise concluída com sucesso. ${result.foods.length} alimento(s) identificado(s).`
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro na análise:', error)
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
