export function formatToLakhCrore(amount: number): string {
  if (amount >= 10000000) {
    // 1 crore = 10000000
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    // 1 lakh = 100000
    return `₹${(amount / 100000).toFixed(2)} L`
  } else {
    return `₹${amount.toFixed(2)}`
  }
}

export function formatNumberToIndian(num: number): string {
  const numStr = num.toString()
  let lastThree = numStr.substring(numStr.length - 3)
  const otherNumbers = numStr.substring(0, numStr.length - 3)
  if (otherNumbers !== "") {
    lastThree = "," + lastThree
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree
}

