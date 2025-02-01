"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatToLakhCrore, formatNumberToIndian } from "../utils/format-currency"

interface TaxSlab {
  min: number
  max: number
  rate: number
}

const STANDARD_DEDUCTION = 75000
const TAX_FREE_LIMIT = 1200000
const TOTAL_TAX_FREE_LIMIT = TAX_FREE_LIMIT + STANDARD_DEDUCTION

const TAX_SLABS: TaxSlab[] = [
  { min: 0, max: 300000, rate: 0.05 },
  { min: 300000, max: 600000, rate: 0.1 },
  { min: 600000, max: 900000, rate: 0.15 },
  { min: 900000, max: 1200000, rate: 0.2 },
  { min: 1200000, max: 1500000, rate: 0.25 },
  { min: 1500000, max: Number.POSITIVE_INFINITY, rate: 0.3 },
]

export default function TaxCalculator() {
  const [income, setIncome] = useState<string>("")

  const calculateTax = (amount: number) => {
    // Apply standard deduction
    const incomeAfterDeduction = Math.max(amount - STANDARD_DEDUCTION, 0)

    let taxableIncome: number
    if (amount <= TOTAL_TAX_FREE_LIMIT) {
      taxableIncome = 0
    } else {
      taxableIncome = incomeAfterDeduction
    }

    let totalTax = 0
    const taxBreakdown = []

    for (const slab of TAX_SLABS) {
      if (taxableIncome > slab.min) {
        const taxableInThisSlab = Math.min(taxableIncome - slab.min, slab.max - slab.min)
        const taxInThisSlab = taxableInThisSlab * slab.rate
        totalTax += taxInThisSlab

        if (taxInThisSlab > 0) {
          taxBreakdown.push({
            slab: `${formatToLakhCrore(slab.min)} - ${formatToLakhCrore(slab.max)}`,
            rate: `${slab.rate * 100}%`,
            tax: taxInThisSlab,
          })
        }
      }
    }

    let surcharge = 0
    if (amount > 5000000) {
      surcharge = totalTax * 0.1
    }

    const cess = (totalTax + surcharge) * 0.04

    return {
      totalTax,
      surcharge,
      cess,
      finalTax: totalTax + surcharge + cess,
      breakdown: taxBreakdown,
      taxableIncome,
      incomeAfterDeduction,
    }
  }

  const taxDetails = income ? calculateTax(Number(income)) : null
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-purple-800 dark:text-purple-200">
            Income Tax Calculator FY 2025-26
          </CardTitle>
          <p className="text-center text-sm text-purple-600 dark:text-purple-300">Calculate your income tax easily</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="income" className="text-purple-700 dark:text-purple-300">
                Annual Income
              </Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your annual income"
                className="bg-white/50 dark:bg-white/10 text-white md:text-xl text-xl border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
              />
              {income && (
                <p className="text-sm text-purple-600 dark:text-purple-300">
                  {formatToLakhCrore(Number(income))} (₹{formatNumberToIndian(Number(income))})
                </p>
              )}
            </div>

            {taxDetails && (
              <div className="space-y-6">
                <Card className="bg-white/70 dark:bg-gray-800/70">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Income after Std. Deduction</p>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {formatToLakhCrore(taxDetails.incomeAfterDeduction)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.incomeAfterDeduction)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Taxable Income</p>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {formatToLakhCrore(taxDetails.taxableIncome)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.taxableIncome)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Base Tax</p>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {formatToLakhCrore(taxDetails.totalTax)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.totalTax)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Final Tax</p>
                        <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                          {formatToLakhCrore(taxDetails.finalTax)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.finalTax)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">Surcharge (10%)</p>
                        <p className="text-xl text-purple-700 dark:text-purple-300">
                          {formatToLakhCrore(taxDetails.surcharge)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.surcharge)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-purple-600 dark:text-purple-300">H/E Cess (4%)</p>
                        <p className="text-xl text-purple-700 dark:text-purple-300">
                          {formatToLakhCrore(taxDetails.cess)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          ₹{formatNumberToIndian(taxDetails.cess)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-200 dark:bg-purple-900">
                      <TableHead className="text-purple-800 dark:text-purple-200">Income Slab</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200">Rate</TableHead>
                      <TableHead className="text-right text-purple-800 dark:text-purple-200">Tax Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxDetails.breakdown.map((item, index) => (
                      <TableRow key={index} className="bg-white/50 dark:bg-gray-800/50">
                        <TableCell className="text-purple-700 dark:text-purple-300">{item.slab}</TableCell>
                        <TableCell className="text-purple-700 dark:text-purple-300">{item.rate}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-purple-800 dark:text-purple-200">{formatToLakhCrore(item.tax)}</span>
                          <br />
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            ₹{formatNumberToIndian(item.tax)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-purple-600 dark:text-purple-300">
            * A standard deduction of ₹75,000 is applied to the income. If total income (before standard deduction) is
            ₹12,75,000 or less, no tax is applicable. For income above ₹12,75,000, tax is calculated on the entire
            income after standard deduction.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

