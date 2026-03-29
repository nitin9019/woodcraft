# WoodCraft Furniture Services

## 1. Setup MongoDB (Database)
Since you don't have MongoDB installed yet, the easiest way is to use the free cloud database called **MongoDB Atlas** or install it locally.

### Option A: MongoDB Atlas (Recommended - Free Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a **Shared Cluster** (the free tier option).
3. Once the cluster is created, go to **Database Access** on the left menu and create a new database user (e.g., username `woodcraft_user` and a password you remember).
4. Go to **Network Access** and click "Add IP Address", then choose "Allow Access from Anywhere" (`0.0.0.0/0`) so your local app can connect.
5. Go back to **Databases** and click **Connect**, choose "Connect your application", and select "Python" as the driver.
6. Copy the connection string. It will look something like this:
   `mongodb+srv://woodcraft_user:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
7. Open the `backend/.env` file in your project folder and replace the `MONGO_URI` line with your copied string. **Make sure to replace `<password>` with the actual password you created in step 3.**

### Option B: Local MongoDB (Offline)
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community) and install it on your Windows PC. Choose the "Complete" installation type.
2. The `backend/.env` file is already set up to point to `mongodb://localhost:27017` by default, so if you install it locally, you don't need to change any text.

## 2. Run the Application
1. Double-click the `start.bat` file in your project folder.
2. Two black command window panels will pop up automatically:
   - One runs the **Backend API** on port 8000.
   - One runs the **Frontend Website** on port 5173.
3. Open your web browser (like Chrome or Edge) and go to **http://localhost:5173** to view and use the website!

## 3. Testing the Application
- **Admin Access:** Go to Sign In and use the username: `admin` and password: `Madhav@1` to access the Admin Dashboard.
- **Normal Users:** Use the "Register" link on the site to create an account, browse products, and submit bookings/repairs.
