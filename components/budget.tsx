'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MinusIcon } from 'lucide-react'

interface BudgetItem {
  name: string
  amount: string
}

type sankeyType = 'personal' | 'business' | 'company'
type budgetField = 'income' | 'expenditure' | 'revenue' | 'costofrevenue' | 'opex' | 'taxes'

export default function Budget() {
  const [incomes, setIncomes] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [expenditures, setExpenditures] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [revenue, setRevenue] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [costOfRevenue, setCostOfRevenue] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [opex, setOpex] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [taxes, setTaxes] = useState<BudgetItem[]>([{ name: '', amount: '' }])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sankeyType, setSankeyType] = useState<sankeyType>('personal')

  const addField = (type: budgetField) => {
    switch (type) {
      case 'income':
        setIncomes([...incomes, { name: '', amount: '' }])
        break
      case 'expenditure':
        setExpenditures([...expenditures, { name: '', amount: '' }])
        break
      case 'revenue':
        setRevenue([...revenue, { name: '', amount: '' }])
        break
      case 'costofrevenue':
        setCostOfRevenue([...costOfRevenue, { name: '', amount: '' }])
        break
      case 'opex':
        setOpex([...opex, { name: '', amount: '' }])
        break
      case 'taxes':
        setTaxes([...taxes, { name: '', amount: '' }])
        break
    }
  }

  const removeField = (type: budgetField, index: number) => {
    switch (type) {
      case 'income':
        setIncomes(incomes.filter((_, i) => i !== index))
        break
      case 'expenditure':
        setExpenditures(expenditures.filter((_, i) => i !== index))
        break
      case 'revenue':
        setRevenue(revenue.filter((_, i) => i !== index))
        break
      case 'costofrevenue':
        setCostOfRevenue(costOfRevenue.filter((_, i) => i !== index))
        break
      case 'opex':
        setOpex(opex.filter((_, i) => i !== index))
        break
      case 'taxes':
        setTaxes(taxes.filter((_, i) => i !== index))
        break
    }
  }

  const updateField = (type: budgetField, index: number, field: 'name' | 'amount', value: string) => {
    switch (type) {
      case 'income':
        const newIncomes = [...incomes]
        newIncomes[index][field] = value
        setIncomes(newIncomes)
        break
      case 'expenditure':
        const newExpenditures = [...expenditures]
        newExpenditures[index][field] = value
        setExpenditures(newExpenditures)
        break
      case 'revenue':
        const newRevenue = [...revenue]
        newRevenue[index][field] = value
        setRevenue(newRevenue)
        break
      case 'costofrevenue':
        const newCostOfRevenue = [...costOfRevenue]
        newCostOfRevenue[index][field] = value
        setCostOfRevenue(newCostOfRevenue)
        break
      case 'opex':
        const newOpex = [...opex]
        newOpex[index][field] = value
        setOpex(newOpex)
        break
      case 'taxes':
        const newTaxes = [...taxes]
        newTaxes[index][field] = value
        setTaxes(newTaxes)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setImageUrl(null)
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
      const response = await fetch('https://sankey.millerding.com/build/budget', {
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
        }, 1000)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const renderFields = (type: budgetField, items: BudgetItem[]) => (
    <>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2">
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
      <button role="link" onClick={(e) => {e.preventDefault();addField(type);}} className ="text-xs text-gray-500 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-gray-500 after:transition-transform after:duration-150 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0">Add {type == 'costofrevenue' ? 'cost of revenue' : type}</button>
    </>
  )

  const changesankeyType = (type: sankeyType) => {
    setSankeyType(type)
    setIncomes([{ name: '', amount: '' }])
    setExpenditures([{ name: '', amount: '' }])
    setRevenue([{ name: '', amount: '' }])
    setCostOfRevenue([{ name: '', amount: '' }])
    setOpex([{ name: '', amount: '' }])
    setTaxes([{ name: '', amount: '' }])
    setImageUrl(null)
  }

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
            <form onSubmit={handleSubmit} className="space-y-2">
              {sankeyType === 'personal' ? (
                <>
                  <div className="animate-fade-in">
                    <div className="mb-2">
                      <h3 className="text-lg font-medium mb-2 text-green-900">Incomes</h3>
                      {renderFields('income', incomes)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-pink-900">Expenditures</h3>
                      {renderFields('expenditure', expenditures)}
                    </div>
                  </div>
                </>
              ) : sankeyType === 'business' ? (
                <>
                  <div className="animate-fade-in">
                    <div className="mb-2">
                      <h3 className="text-lg font-medium mb-2 text-green-900">Revenue</h3>
                      {renderFields('revenue', revenue)}
                    </div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium mb-2 text-pink-900">Cost of Revenue</h3>
                      {renderFields('costofrevenue', costOfRevenue)}
                    </div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium mb-2 text-pink-900">Operating Expenses</h3>
                      {renderFields('opex', opex)}
                    </div>
                    <div className="mb-2">
                      <h3 className="text-lg font-medium mb-2 text-pink-900">Taxes</h3>
                      {renderFields('taxes', taxes)}
                    </div>
                  </div>
                </>
              ) : sankeyType === 'company' ? (
                <>
                  <div>
                    {/*placeholder*/}
                  </div>
                </>
              ) : null}
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
                  'Generate'
                )}
              </span>
            </button>
          </CardFooter>
        </Card>

        <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none shadow-xl flex flex-col">
          <CardHeader>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text">
              Result
            </h1>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {imageUrl != null ? (
              <img
                src={imageUrl}
                alt="Budget visualization"
                width={300}
                height={300}
                className="rounded-lg object-cover max-w-full max-h-full animate-fade-in-graph"
              />
            ) : (
              <p className="text-gray-400 text-center">
                Generated budget diagrams will appear here!
              </p>
            )}
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-2 flex justify-center space-x-4 font-extrabold">
          <button onClick={() => changesankeyType('personal')} className="relative min-h-10 rounded bg-white px-3 py-1.5 text-purple-800 transition-all duration-300 hover:bg-gray-100 hover:ring-2 hover:ring-purple-700 hover:ring-offset-2"><span className="relative">Personal Budget</span></button>
          <button onClick={() => changesankeyType('business')} className="relative min-h-10 rounded bg-white px-3 py-1.5 text-purple-800 transition-all duration-300 hover:bg-gray-100 hover:ring-2 hover:ring-purple-700 hover:ring-offset-2"><span className="relative">Business Cashflow</span></button>
          {/*<button onClick={() => changesankeyType('company')} className="relative min-h-10 rounded bg-white px-3 py-1.5 text-purple-800 transition-all duration-300 hover:bg-gray-100 hover:ring-2 hover:ring-purple-700 hover:ring-offset-2"><span className="relative">Company Financials</span></button>*/}
        </div>
      </div>
    </div>
  )
}
