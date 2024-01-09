import { useSelector } from "react-redux";
import { RootState } from "store";
import { ICategory } from "./type";
import { ca } from "date-fns/locale";

type Props = {};

const useFinance = () => {
  const finance = useSelector((item: RootState) => item.finance);
  const expenseList = finance.expense.expenseList;
  const categories = finance.categories;
  const tags = finance.tags;
  const expenseCreateMode = finance.expense.createMode;

  const selectedExpense = finance.expense.selectedExpense;


  const getFlatCategories = (categories:  ICategory[]) => {
    const options:any[] = []
    categories.forEach((category:ICategory) => {
      category.childCategories.forEach((subCategory: ICategory) => {
        options.push({label: subCategory.name, value: subCategory.categoryId})
      })
    })
    return options;
  }

  const getPaidAmount = (expense: any) => {
    let paidAmount = 0;
    expenseList.forEach((expense: any) => {
      if (expense.status === "paid") {
        paidAmount += parseFloat(expense.totalAmount.value);
      }
    })
    return paidAmount;
  }

  const getUnpaidAmount = (expense: any) => {
    let unpaidAmount = 0;
    expenseList.forEach((expense: any) => {
      if (expense.status === "unpaid") {
        unpaidAmount += parseFloat(expense.totalAmount.value);
      }
    })
    return unpaidAmount;
  }

  const getRejectedAmount = (expense: any) => {
    let rejectedAmount = 0;
    expenseList.forEach((expense: any) => {
      if (expense.status === "rejected") {
        rejectedAmount += parseFloat(expense.totalAmount.value);
      }
    })
    return rejectedAmount;
  }

  const paidAmount = getPaidAmount(expenseList);
  const unpaidAmount = getUnpaidAmount(expenseList);
  const rejectedAmount = getRejectedAmount(expenseList);
  

  return {
    expenseList,
    selectedExpense,
    categories,
    tags,
    getFlatCategories,
    getPaidAmount,
    getUnpaidAmount,
    getRejectedAmount,
    paidAmount,
    unpaidAmount,
    rejectedAmount,
    expenseCreateMode
  };
};

export default useFinance;