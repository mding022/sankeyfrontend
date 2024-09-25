'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, MinusIcon } from 'lucide-react'

interface BudgetItem {
  name: string
  amount: string
}

export default function Budget() {
  const [incomes, setIncomes] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [expenditures, setExpenditures] = useState<BudgetItem[]>([{ name: '', amount: '' }])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', { incomes, expenditures })
  }

  const renderFields = (type: 'income' | 'expenditure', items: BudgetItem[]) => (
    <>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <Input
            placeholder="Name"
            value={item.name}
            onChange={(e) => updateField(type, index, 'name', e.target.value)}
            className="bg-white bg-opacity-20 border-none placeholder-gray-400"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={(e) => updateField(type, index, 'amount', e.target.value)}
            className="bg-white bg-opacity-20 border-none placeholder-gray-400"
          />
          {items.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => removeField(type, index)} className="hover:bg-white hover:bg-opacity-20">
              <MinusIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={() => addField(type)} className="hover:bg-white hover:bg-opacity-20">
        <PlusIcon className="h-4 w-4 mr-2" /> Add {type}
      </Button>
    </>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-400 via-teal-500 to-blue-500">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4">
        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Budget Maker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Incomes</h3>
                {renderFields('income', incomes)}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Expenditures</h3>
                {renderFields('expenditure', expenditures)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-none">
              Generate Budget
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}