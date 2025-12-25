const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
  } catch (error) {
    return res.status(500).json({
      message: "Failed to register user, Server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Login user, Server error",
      error: error.message,
    });
  }
};
