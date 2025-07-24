<h1>QuickBite 🍔</h1>

<p><strong>QuickBite</strong> is a full-stack food delivery web application where users can browse meals, register/login securely, verify their email using OTP, manage their cart, and place orders.</p>

<hr>

<h2>🚀 Features</h2>
<ul>
  <li>User Registration & Login with JWT</li>
  <li>Email verification using OTP (sent via Nodemailer)</li>
  <li>Browse food items with images</li>
  <li>Add to Cart / Remove from Cart</li>
  <li>Place Orders with address and total amount</li>
  <li>View Order History</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>

<ul>
  <li><strong>Frontend:</strong> React, React Router, Axios, Toastify</li>
  <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
  <li><strong>Authentication:</strong> JWT, bcrypt, OTP via Nodemailer</li>
  <li><strong>Other:</strong> dotenv, Stripe (optional for payments)</li>
</ul>

<hr>

<h2>📁 Folder Structure</h2>

<pre>
QuickBite/
├── backend/
├── frontend/
├── admin/
</pre>

<hr>

<h2>🔧 Environment Setup (.env)</h2>

<p>Create a <code>.env</code> file inside the <code>backend</code> folder and add:</p>

<pre>
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AUTH_EMAIL=your_email@example.com
AUTH_PASS=your_email_app_password
STRIPE_SECRET_KEY=your_stripe_secret_key (optional)
</pre>

<hr>

<h2>📦 Installation</h2>

<ol>
  <li>Clone the repository</li>
  <pre>git clone https://github.com/manmohitsingh23/QuickBite.git</pre>

  <li>Install backend dependencies</li>
  <pre>cd backend
npm install
npm run dev</pre>

  <li>Install frontend dependencies</li>
  <pre>cd ../frontend
npm install
npm start</pre>
</ol>

<hr>

<h2>📌 Usage</h2>
<ul>
  <li>Register → OTP Verification → Login</li>
  <li>Browse food items</li>
  <li>Add to cart & place an order</li>
  <li>View order status in "My Orders"</li>
</ul>

<hr>

<h2>👨‍💻 Author</h2>
<p><strong>Manmohit Singh</strong><br>
GitHub: <a href="https://github.com/manmohitsingh23">manmohitsingh23</a>
</p>

<hr>

<p><strong>Enjoy your food 🍕 and code 💻!</strong></p>
---

<h2>🔒 License</h2>
<p>This project is licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>.</p>

---
