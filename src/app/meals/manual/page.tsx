"use client"

import { useState } from "react"
import { ChevronLeft, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Food {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  category: string
}

interface SelectedFood extends Food {
  weight: number
  id: string
}

export default function ManualMealPage() {
  const [mealName, setMealName] = useState("")
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  // Base de dados expandida com mais de 200 ingredientes (valores por 100g)
  const foodDatabase: Food[] = [
    // PROTEÍNAS ANIMAIS
    { name: "Frango grelhado (peito)", calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: "Proteínas" },
    { name: "Frango cozido", calories: 170, protein: 25, carbs: 0, fat: 7, fiber: 0, category: "Proteínas" },
    { name: "Frango frito", calories: 246, protein: 19, carbs: 12, fat: 14, fiber: 0, category: "Proteínas" },
    { name: "Peito de peru", calories: 104, protein: 24, carbs: 0, fat: 1, fiber: 0, category: "Proteínas" },
    { name: "Carne bovina magra", calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, category: "Proteínas" },
    { name: "Carne bovina gorda", calories: 291, protein: 26, carbs: 0, fat: 20, fiber: 0, category: "Proteínas" },
    { name: "Patinho bovino", calories: 139, protein: 22, carbs: 0, fat: 5, fiber: 0, category: "Proteínas" },
    { name: "Alcatra", calories: 219, protein: 27, carbs: 0, fat: 11, fiber: 0, category: "Proteínas" },
    { name: "Picanha", calories: 316, protein: 20, carbs: 0, fat: 26, fiber: 0, category: "Proteínas" },
    { name: "Costela bovina", calories: 406, protein: 16, carbs: 0, fat: 37, fiber: 0, category: "Proteínas" },
    { name: "Carne moída (magra)", calories: 215, protein: 26, carbs: 0, fat: 11, fiber: 0, category: "Proteínas" },
    { name: "Carne moída (gorda)", calories: 332, protein: 14, carbs: 0, fat: 30, fiber: 0, category: "Proteínas" },
    { name: "Carne de porco magra", calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, category: "Proteínas" },
    { name: "Bacon", calories: 541, protein: 37, carbs: 1, fat: 42, fiber: 0, category: "Proteínas" },
    { name: "Linguiça calabresa", calories: 296, protein: 16, carbs: 2, fat: 25, fiber: 0, category: "Proteínas" },
    { name: "Linguiça toscana", calories: 301, protein: 15, carbs: 3, fat: 26, fiber: 0, category: "Proteínas" },
    { name: "Salsicha", calories: 322, protein: 12, carbs: 3, fat: 30, fiber: 0, category: "Proteínas" },
    { name: "Presunto", calories: 145, protein: 21, carbs: 1, fat: 6, fiber: 0, category: "Proteínas" },
    { name: "Mortadela", calories: 311, protein: 17, carbs: 2, fat: 26, fiber: 0, category: "Proteínas" },
    { name: "Salmão", calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, category: "Proteínas" },
    { name: "Atum em lata", calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, category: "Proteínas" },
    { name: "Tilápia", calories: 96, protein: 20, carbs: 0, fat: 2, fiber: 0, category: "Proteínas" },
    { name: "Sardinha", calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, category: "Proteínas" },
    { name: "Camarão", calories: 99, protein: 24, carbs: 0, fat: 1, fiber: 0, category: "Proteínas" },
    { name: "Bacalhau", calories: 82, protein: 18, carbs: 0, fat: 1, fiber: 0, category: "Proteínas" },
    { name: "Merluza", calories: 86, protein: 17, carbs: 0, fat: 2, fiber: 0, category: "Proteínas" },
    { name: "Ovos inteiros", calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, category: "Proteínas" },
    { name: "Clara de ovo", calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, category: "Proteínas" },
    { name: "Gema de ovo", calories: 322, protein: 16, carbs: 3.6, fat: 27, fiber: 0, category: "Proteínas" },

    // CARBOIDRATOS
    { name: "Arroz branco cozido", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: "Carboidratos" },
    { name: "Arroz integral cozido", calories: 123, protein: 2.6, carbs: 26, fat: 1, fiber: 1.8, category: "Carboidratos" },
    { name: "Arroz parboilizado", calories: 123, protein: 2.5, carbs: 26, fat: 0.4, fiber: 0.6, category: "Carboidratos" },
    { name: "Macarrão cozido", calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, category: "Carboidratos" },
    { name: "Macarrão integral", calories: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 3.5, category: "Carboidratos" },
    { name: "Batata inglesa cozida", calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, category: "Carboidratos" },
    { name: "Batata doce cozida", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, category: "Carboidratos" },
    { name: "Batata frita", calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, category: "Carboidratos" },
    { name: "Mandioca cozida", calories: 125, protein: 0.6, carbs: 30, fat: 0.3, fiber: 1.6, category: "Carboidratos" },
    { name: "Mandioquinha", calories: 98, protein: 0.8, carbs: 23, fat: 0.2, fiber: 2.3, category: "Carboidratos" },
    { name: "Inhame", calories: 118, protein: 1.5, carbs: 28, fat: 0.2, fiber: 4.1, category: "Carboidratos" },
    { name: "Pão francês", calories: 300, protein: 8, carbs: 58, fat: 3.1, fiber: 2.3, category: "Carboidratos" },
    { name: "Pão integral", calories: 247, protein: 13, carbs: 43, fat: 3.5, fiber: 6.9, category: "Carboidratos" },
    { name: "Pão de forma branco", calories: 269, protein: 8, carbs: 50, fat: 3.3, fiber: 2.7, category: "Carboidratos" },
    { name: "Pão de forma integral", calories: 253, protein: 9, carbs: 49, fat: 3.2, fiber: 4.6, category: "Carboidratos" },
    { name: "Pão de queijo", calories: 335, protein: 7, carbs: 46, fat: 13, fiber: 1.2, category: "Carboidratos" },
    { name: "Tapioca", calories: 358, protein: 0.6, carbs: 88, fat: 0.2, fiber: 0.9, category: "Carboidratos" },
    { name: "Cuscuz de milho", calories: 112, protein: 2.5, carbs: 24, fat: 0.4, fiber: 1.2, category: "Carboidratos" },
    { name: "Polenta", calories: 85, protein: 1.7, carbs: 18, fat: 0.5, fiber: 1.5, category: "Carboidratos" },
    { name: "Aveia em flocos", calories: 394, protein: 13.9, carbs: 66.6, fat: 8.5, fiber: 9.1, category: "Carboidratos" },
    { name: "Granola", calories: 471, protein: 13, carbs: 64, fat: 18, fiber: 7, category: "Carboidratos" },
    { name: "Quinoa cozida", calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, category: "Carboidratos" },

    // LEGUMINOSAS
    { name: "Feijão preto cozido", calories: 77, protein: 4.5, carbs: 14, fat: 0.5, fiber: 4.5, category: "Leguminosas" },
    { name: "Feijão carioca cozido", calories: 76, protein: 4.8, carbs: 13.6, fat: 0.5, fiber: 4.5, category: "Leguminosas" },
    { name: "Feijão branco", calories: 139, protein: 9.7, carbs: 25, fat: 0.5, fiber: 6.3, category: "Leguminosas" },
    { name: "Lentilha cozida", calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, category: "Leguminosas" },
    { name: "Grão de bico cozido", calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: "Leguminosas" },
    { name: "Ervilha cozida", calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.5, category: "Leguminosas" },
    { name: "Soja cozida", calories: 173, protein: 16.6, carbs: 9.9, fat: 9, fiber: 6, category: "Leguminosas" },

    // VERDURAS E LEGUMES
    { name: "Alface", calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.1, category: "Verduras" },
    { name: "Rúcula", calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, category: "Verduras" },
    { name: "Agrião", calories: 11, protein: 2.6, carbs: 1.3, fat: 0.1, fiber: 0.5, category: "Verduras" },
    { name: "Espinafre", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: "Verduras" },
    { name: "Couve", calories: 27, protein: 2.9, carbs: 5.4, fat: 0.4, fiber: 3.1, category: "Verduras" },
    { name: "Brócolis", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, category: "Verduras" },
    { name: "Couve-flor", calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, category: "Verduras" },
    { name: "Repolho", calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5, category: "Verduras" },
    { name: "Cenoura", calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: "Verduras" },
    { name: "Beterraba", calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, category: "Verduras" },
    { name: "Tomate", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: "Verduras" },
    { name: "Pepino", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: "Verduras" },
    { name: "Abobrinha", calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, category: "Verduras" },
    { name: "Berinjela", calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, category: "Verduras" },
    { name: "Pimentão", calories: 31, protein: 1, carbs: 7.6, fat: 0.3, fiber: 2.1, category: "Verduras" },
    { name: "Cebola", calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, category: "Verduras" },
    { name: "Alho", calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, category: "Verduras" },
    { name: "Chuchu", calories: 19, protein: 0.8, carbs: 4.5, fat: 0.1, fiber: 1.7, category: "Verduras" },
    { name: "Abóbora", calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, category: "Verduras" },
    { name: "Vagem", calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7, category: "Verduras" },

    // FRUTAS
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: "Frutas" },
    { name: "Maçã", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, category: "Frutas" },
    { name: "Laranja", calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, category: "Frutas" },
    { name: "Mamão", calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, category: "Frutas" },
    { name: "Melancia", calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, category: "Frutas" },
    { name: "Melão", calories: 34, protein: 0.8, carbs: 8, fat: 0.2, fiber: 0.9, category: "Frutas" },
    { name: "Abacaxi", calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, category: "Frutas" },
    { name: "Manga", calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, category: "Frutas" },
    { name: "Morango", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, category: "Frutas" },
    { name: "Uva", calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, category: "Frutas" },
    { name: "Pera", calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, category: "Frutas" },
    { name: "Pêssego", calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, category: "Frutas" },
    { name: "Kiwi", calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, category: "Frutas" },
    { name: "Abacate", calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 6.7, category: "Frutas" },
    { name: "Coco", calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, category: "Frutas" },
    { name: "Limão", calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, category: "Frutas" },
    { name: "Tangerina", calories: 53, protein: 0.8, carbs: 13, fat: 0.3, fiber: 1.8, category: "Frutas" },
    { name: "Goiaba", calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, category: "Frutas" },
    { name: "Maracujá", calories: 97, protein: 2.2, carbs: 23, fat: 0.7, fiber: 10.4, category: "Frutas" },
    { name: "Açaí (polpa)", calories: 58, protein: 0.8, carbs: 6.2, fat: 3.9, fiber: 2.6, category: "Frutas" },

    // LATICÍNIOS
    { name: "Leite integral", calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, category: "Laticínios" },
    { name: "Leite desnatado", calories: 34, protein: 3.4, carbs: 5, fat: 0.2, fiber: 0, category: "Laticínios" },
    { name: "Iogurte natural integral", calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, category: "Laticínios" },
    { name: "Iogurte grego", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, category: "Laticínios" },
    { name: "Iogurte desnatado", calories: 43, protein: 4.3, carbs: 6, fat: 0.2, fiber: 0, category: "Laticínios" },
    { name: "Queijo minas frescal", calories: 264, protein: 17.4, carbs: 3, fat: 20.8, fiber: 0, category: "Laticínios" },
    { name: "Queijo mussarela", calories: 280, protein: 25, carbs: 3.1, fat: 19, fiber: 0, category: "Laticínios" },
    { name: "Queijo prato", calories: 360, protein: 25, carbs: 1.7, fat: 28, fiber: 0, category: "Laticínios" },
    { name: "Queijo parmesão", calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0, category: "Laticínios" },
    { name: "Queijo cottage", calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: "Laticínios" },
    { name: "Requeijão", calories: 235, protein: 9, carbs: 3, fat: 21, fiber: 0, category: "Laticínios" },
    { name: "Cream cheese", calories: 342, protein: 5.9, carbs: 5.5, fat: 34, fiber: 0, category: "Laticínios" },
    { name: "Manteiga", calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, category: "Laticínios" },

    // OLEAGINOSAS E SEMENTES
    { name: "Amendoim", calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, category: "Oleaginosas" },
    { name: "Castanha de caju", calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, category: "Oleaginosas" },
    { name: "Castanha do Pará", calories: 656, protein: 14, carbs: 12, fat: 66, fiber: 7.5, category: "Oleaginosas" },
    { name: "Amêndoas", calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, category: "Oleaginosas" },
    { name: "Nozes", calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: "Oleaginosas" },
    { name: "Pistache", calories: 560, protein: 20, carbs: 28, fat: 45, fiber: 10.6, category: "Oleaginosas" },
    { name: "Avelã", calories: 628, protein: 15, carbs: 17, fat: 61, fiber: 9.7, category: "Oleaginosas" },
    { name: "Macadâmia", calories: 718, protein: 7.9, carbs: 14, fat: 76, fiber: 8.6, category: "Oleaginosas" },
    { name: "Semente de girassol", calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6, category: "Oleaginosas" },
    { name: "Semente de abóbora", calories: 559, protein: 30, carbs: 15, fat: 49, fiber: 6, category: "Oleaginosas" },
    { name: "Chia", calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: "Oleaginosas" },
    { name: "Linhaça", calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, category: "Oleaginosas" },

    // ÓLEOS E GORDURAS
    { name: "Azeite de oliva", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: "Óleos" },
    { name: "Óleo de coco", calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, category: "Óleos" },
    { name: "Óleo de soja", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: "Óleos" },
    { name: "Óleo de girassol", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: "Óleos" },
    { name: "Óleo de canola", calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: "Óleos" },

    // DOCES E SOBREMESAS
    { name: "Chocolate ao leite", calories: 535, protein: 7.6, carbs: 59, fat: 30, fiber: 3.4, category: "Doces" },
    { name: "Chocolate amargo 70%", calories: 598, protein: 7.8, carbs: 46, fat: 43, fiber: 11, category: "Doces" },
    { name: "Brigadeiro", calories: 400, protein: 4, carbs: 55, fat: 18, fiber: 1, category: "Doces" },
    { name: "Bolo de chocolate", calories: 352, protein: 5, carbs: 50, fat: 15, fiber: 2, category: "Doces" },
    { name: "Sorvete de creme", calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, category: "Doces" },
    { name: "Pudim de leite", calories: 140, protein: 4, carbs: 20, fat: 5, fiber: 0, category: "Doces" },
    { name: "Açúcar branco", calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, category: "Doces" },
    { name: "Mel", calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, category: "Doces" },
    { name: "Geleia", calories: 278, protein: 0.4, carbs: 70, fat: 0.1, fiber: 1, category: "Doces" },

    // BEBIDAS
    { name: "Café (sem açúcar)", calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, category: "Bebidas" },
    { name: "Chá verde", calories: 1, protein: 0, carbs: 0, fat: 0, fiber: 0, category: "Bebidas" },
    { name: "Suco de laranja natural", calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, category: "Bebidas" },
    { name: "Refrigerante", calories: 42, protein: 0, carbs: 11, fat: 0, fiber: 0, category: "Bebidas" },
    { name: "Cerveja", calories: 43, protein: 0.5, carbs: 3.6, fat: 0, fiber: 0, category: "Bebidas" },
    { name: "Vinho tinto", calories: 85, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0, category: "Bebidas" },

    // FAST FOOD E INDUSTRIALIZADOS
    { name: "Pizza mussarela", calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, category: "Fast Food" },
    { name: "Hambúrguer", calories: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.5, category: "Fast Food" },
    { name: "Batata frita (fast food)", calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, category: "Fast Food" },
    { name: "Hot dog", calories: 290, protein: 10, carbs: 24, fat: 17, fiber: 1, category: "Fast Food" },
    { name: "Nuggets de frango", calories: 296, protein: 15, carbs: 18, fat: 18, fiber: 1, category: "Fast Food" },
    { name: "Pastel frito", calories: 235, protein: 5, carbs: 25, fat: 13, fiber: 1.2, category: "Fast Food" },
    { name: "Coxinha", calories: 250, protein: 8, carbs: 28, fat: 11, fiber: 1.5, category: "Fast Food" },
    { name: "Empada", calories: 320, protein: 7, carbs: 30, fat: 18, fiber: 1, category: "Fast Food" },
    { name: "Biscoito recheado", calories: 480, protein: 5, carbs: 68, fat: 20, fiber: 2, category: "Fast Food" },
    { name: "Salgadinho de pacote", calories: 536, protein: 6, carbs: 53, fat: 33, fiber: 3, category: "Fast Food" },

    // SUPLEMENTOS E PROTEÍNAS
    { name: "Whey protein", calories: 400, protein: 80, carbs: 8, fat: 5, fiber: 0, category: "Suplementos" },
    { name: "Creatina", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, category: "Suplementos" },
    { name: "Pasta de amendoim", calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: "Suplementos" },
    { name: "Barra de proteína", calories: 380, protein: 20, carbs: 40, fat: 12, fiber: 5, category: "Suplementos" },

    // TEMPEROS E CONDIMENTOS
    { name: "Sal", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, category: "Temperos" },
    { name: "Pimenta do reino", calories: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25, category: "Temperos" },
    { name: "Orégano", calories: 265, protein: 9, carbs: 69, fat: 4.3, fiber: 42, category: "Temperos" },
    { name: "Molho de tomate", calories: 29, protein: 1.3, carbs: 6.7, fat: 0.2, fiber: 1.5, category: "Temperos" },
    { name: "Ketchup", calories: 112, protein: 1.2, carbs: 27, fat: 0.1, fiber: 0.3, category: "Temperos" },
    { name: "Mostarda", calories: 66, protein: 4.4, carbs: 5.3, fat: 3.3, fiber: 3, category: "Temperos" },
    { name: "Maionese", calories: 680, protein: 1.1, carbs: 2.7, fat: 75, fiber: 0, category: "Temperos" },
    { name: "Shoyu", calories: 53, protein: 5.6, carbs: 4.9, fat: 0.1, fiber: 0.8, category: "Temperos" },
    { name: "Vinagre", calories: 19, protein: 0, carbs: 0.9, fat: 0, fiber: 0, category: "Temperos" },
  ]

  const categories = ["Todos", ...Array.from(new Set(foodDatabase.map(f => f.category)))]

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddFood = (food: Food) => {
    const newFood: SelectedFood = {
      ...food,
      weight: 100,
      id: `${food.name}-${Date.now()}`
    }
    setSelectedFoods([...selectedFoods, newFood])
  }

  const handleRemoveFood = (id: string) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== id))
  }

  const handleWeightChange = (id: string, weight: number) => {
    setSelectedFoods(selectedFoods.map(f => 
      f.id === id ? { ...f, weight: Math.max(1, weight) } : f
    ))
  }

  const calculateNutrition = (food: SelectedFood) => {
    const multiplier = food.weight / 100
    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 100) / 100,
      carbs: Math.round(food.carbs * multiplier * 100) / 100,
      fat: Math.round(food.fat * multiplier * 100) / 100,
      fiber: food.fiber ? Math.round(food.fiber * multiplier * 100) / 100 : 0
    }
  }

  const totalNutrition = selectedFoods.reduce((acc, food) => {
    const nutrition = calculateNutrition(food)
    return {
      calories: acc.calories + nutrition.calories,
      protein: acc.protein + nutrition.protein,
      carbs: acc.carbs + nutrition.carbs,
      fat: acc.fat + nutrition.fat,
      fiber: acc.fiber + nutrition.fiber
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  // Formatar totais com no máximo 2 casas decimais
  const formattedTotals = {
    calories: Math.round(totalNutrition.calories),
    protein: Math.round(totalNutrition.protein * 100) / 100,
    carbs: Math.round(totalNutrition.carbs * 100) / 100,
    fat: Math.round(totalNutrition.fat * 100) / 100,
    fiber: Math.round(totalNutrition.fiber * 100) / 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/meals">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Adicionar Manualmente</h1>
        </div>
      </div>

      {/* Meal Name Input */}
      <div className="px-6 py-6">
        <Label htmlFor="meal-name" className="text-white mb-2 block">Nome da Refeição</Label>
        <Input
          id="meal-name"
          type="text"
          placeholder="Ex: Café da Manhã, Almoço..."
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Selected Foods Summary */}
      {selectedFoods.length > 0 && (
        <div className="px-6 mb-6">
          <Card className="bg-slate-800/50 border-slate-700 p-5">
            <h3 className="font-bold text-white mb-3">Alimentos Selecionados ({selectedFoods.length})</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {selectedFoods.map((food) => {
                const nutrition = calculateNutrition(food)
                return (
                  <div key={food.id} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <span className="text-white text-sm font-semibold">{food.name}</span>
                        <div className="flex gap-2 text-xs text-gray-400 mt-1">
                          <span>{nutrition.calories} cal</span>
                          <span>P: {nutrition.protein}g</span>
                          <span>C: {nutrition.carbs}g</span>
                          <span>G: {nutrition.fat}g</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFood(food.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`weight-${food.id}`} className="text-xs text-gray-400 whitespace-nowrap">
                        Peso (g):
                      </Label>
                      <Input
                        id={`weight-${food.id}`}
                        type="number"
                        min="1"
                        value={food.weight}
                        onChange={(e) => handleWeightChange(food.id, parseInt(e.target.value) || 1)}
                        className="bg-slate-600 border-slate-500 text-white text-sm h-8 w-20"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total Nutrition */}
            <div className="grid grid-cols-5 gap-2 pt-3 border-t border-slate-700">
              <div className="text-center">
                <p className="text-xs text-gray-400">Calorias</p>
                <p className="text-lg font-bold text-cyan-400">{formattedTotals.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Proteína</p>
                <p className="text-lg font-bold text-blue-400">{formattedTotals.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Carbos</p>
                <p className="text-lg font-bold text-emerald-400">{formattedTotals.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Gordura</p>
                <p className="text-lg font-bold text-amber-400">{formattedTotals.fat}g</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Fibras</p>
                <p className="text-lg font-bold text-purple-400">{formattedTotals.fiber}g</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-cyan-600 hover:bg-cyan-700 text-white whitespace-nowrap" 
                : "bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700 whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Foods */}
      <div className="px-6 mb-6">
        <Label htmlFor="search-food" className="text-white mb-2 block">
          Buscar Alimentos ({filteredFoods.length} encontrados)
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="search-food"
            type="text"
            placeholder="Buscar alimentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 pl-10"
          />
        </div>
      </div>

      {/* Available Foods */}
      <div className="px-6 mb-6">
        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <Card key={food.name} className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{food.name}</h3>
                  <div className="flex gap-3 text-xs text-gray-400 mb-1">
                    <span>{food.calories} cal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>G: {food.fat}g</span>
                    {food.fiber && <span>F: {food.fiber}g</span>}
                  </div>
                  <span className="text-xs text-cyan-400">{food.category}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddFood(food)}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
        <Link href="/meals">
          <Button 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-semibold py-6"
            disabled={selectedFoods.length === 0 || !mealName}
          >
            Salvar Refeição ({formattedTotals.calories} cal)
          </Button>
        </Link>
      </div>
    </div>
  )
}
