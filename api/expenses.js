// In-memory storage (for demo - use a database in production)
let expenses = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET - Retrieve all expenses
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      expenses: expenses,
      total: expenses.reduce((sum, exp) => sum + exp.amount, 0)
    });
  }

  // POST - Add a new expense
  if (req.method === 'POST') {
    const { description, amount, category, date } = req.body;

    if (!description || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Description and amount are required'
      });
    }

    const newExpense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category: category || 'Other',
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    expenses.push(newExpense);

    return res.status(201).json({
      success: true,
      expense: newExpense
    });
  }

  // DELETE - Remove an expense
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Expense ID is required'
      });
    }

    const initialLength = expenses.length;
    expenses = expenses.filter(exp => exp.id !== id);

    if (expenses.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
