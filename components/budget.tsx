'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { PlusIcon, MinusIcon } from 'lucide-react'

interface BudgetItem {
  name: string
  amount: string
}

export default function Budget() {
  const [incomes, setIncomes] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [expenditures, setExpenditures] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const addField = (type: 'income' | 'expenditure') => {
    if (type === 'income') {
      setIncomes([...incomes, { name: '', amount: '' }])
    } else {
      setExpenditures([...expenditures, { name: '', amount: '' }])
    }
  }

  const removeField = (type: 'income' | 'expenditure', index: number) => {
    if (type === 'income') {
      setIncomes(incomes.filter((_, i) => i !== index))
    } else {
      setExpenditures(expenditures.filter((_, i) => i !== index))
    }
  }

  const updateField = (type: 'income' | 'expenditure', index: number, field: 'name' | 'amount', value: string) => {
    if (type === 'income') {
      const newIncomes = [...incomes]
      newIncomes[index][field] = value
      setIncomes(newIncomes)
    } else {
      const newExpenditures = [...expenditures]
      newExpenditures[index][field] = value
      setExpenditures(newExpenditures)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const incomeAmounts = incomes.map((item) => item.amount).join(',')
    const incomeLabels = incomes.map((item) => item.name).join(',')
    const expenditureAmounts = expenditures.map((item) => item.amount).join(',')
    const expenditureLabels = expenditures.map((item) => item.name).join(',')
    const formData = new URLSearchParams({
      incomes: incomeAmounts,
      ilabels: incomeLabels,
      outputs: expenditureAmounts,
      olabels: expenditureLabels,
    })

    try {
      const response = await fetch('https://api.millerding.com/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (response.ok) {
        const result = await response.text()
        setTimeout(() => {
          setImageUrl(result)
          setLoading(false)
        }, 2500)
      } else {
        console.error('Failed to send data:', response.statusText)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error during submission:', error)
      setLoading(false)
    }
  }

  const renderFields = (type: 'income' | 'expenditure', items: BudgetItem[]) => (
    <>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <Input
            placeholder="Name"
            value={item.name}
            onChange={(e) => updateField(type, index, 'name', e.target.value)}
            className="bg-white bg-opacity-20 border-none placeholder-gray-400 w-full"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={(e) => updateField(type, index, 'amount', e.target.value)}
            className="bg-white bg-opacity-20 border-none placeholder-gray-400 w-full"
          />
          {items.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => removeField(type, index)} className="hover:bg-gray-300 hover:bg-opacity-5 hover:text-purple-900">
              <MinusIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={() => addField(type)} className="hover:bg-gray-300 hover:bg-opacity-5 hover:text-purple-900">
        <PlusIcon className="h-4 w-4 mr-2" /> Add {type}
      </Button>
    </>
  )

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#c1c3c7_1px,transparent_1px)] [background-size:16px_16px] animate-fade-in-dots"></div>
      <div className="max-w-6xl text-gray-800 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 text-accent animate-fade-in">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none shadow-xl flex flex-col">
          <CardHeader>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text">
              Data
            </h1>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-700">Incomes</h3>
                {renderFields('income', incomes)}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-700">Expenditures</h3>
                {renderFields('expenditure', expenditures)}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <button type="submit" onClick={handleSubmit} className="w-full relative inline-block font-medium group py-1.5 px-2.5">
              <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-purple-800 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full bg-white border border-purple-900 group-hover:bg-indigo-50"></span>
              <span className="relative text-purple-800">
                {loading ? (
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-purple-800 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                ) : (
                  'Create'
                )}
              </span>
            </button>
          </CardFooter>
        </Card>

        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none shadow-xl flex flex-col">
          <CardHeader>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text">Visualized Graph</h1>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Budget visualization"
                width={300}
                height={300}
                className="rounded-lg object-cover max-w-full max-h-full animate-fade-in"
              />
            ) : (
              <p className="text-gray-400 text-center">
                Generated budget diagrams will appear here!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
