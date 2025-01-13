# Drivezy Mix (CirCar)

A comprehensive web application designed for car dealerships, **Drivezy Mix** (formerly known as **CirCar**) streamlines dealership operations and improves efficiency. This project leverages modern web development technologies and best practices in software engineering to provide a robust, user-friendly solution addressing inventory management, customer interactions, and automating sales processes.
we have changed the name of the project from CirCar to Drivezy Mix.
---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
    - [Login and Dashboard](#login-and-dashboard)
    - [Navigation](#navigation)
    - [Define Basic Information](#define-basic-information)
    - [Define Basic Data](#define-basic-data)
    - [Define Cars and Customers](#define-cars-and-customers)
    - [Create Contracts and Invoices](#create-contracts-and-invoices)
    - [Reports](#reports)
3. [Database and Schemas](#database-and-schemas)
4. [System Design Analysis](#system-design-analysis)
5. [Backend Development](#backend-development)
6. [Frontend Development](#frontend-development)
7. [Tech Stack](#tech-stack)
8. [Getting Started](#getting-started)
9. [Authors](#authors)
10. [License](#license)

---

## Overview

**Drivezy Mix** is built to enhance day-to-day operations in car dealerships. By focusing on core challenges—like manual data entry, error-prone processes, and time-consuming paperwork—the application aims to reduce overhead and improve workflow efficiency. Key benefits include:

- **Inventory Management**: Maintain detailed information about cars, including images and documents.
- **Customer Management**: Store customer data and generate contracts or invoices with minimal effort.
- **Sales Automation**: Generate different contract and invoice types with dynamic data fields.
- **Reporting**: Create reports for banking, stock checks, and other critical dealership metrics.

---

## Features

### Login and Dashboard

- **URL**: `http://localhost:3000/` (after running both the backend and frontend)
- **Demo Credentials**:
    - User: `parsa@akbari.com`
    - Pass: `123456`

After logging in, users are directed to a **dashboard** containing a quick-access menu for frequently used modules (e.g., Brands, Models, Colors, Cars, Customers, Contracts, Invoices, and Reports).

### Navigation

- The **sidebar menu** provides straightforward navigation between system modules.
- Clear labeling and intuitive design minimize the need for extensive training.

### Define Basic Information

- Enter essential data (e.g., shop owner’s name, shop name, ZIP/postal code, EORI number).
- Used for **PDF creation** and consistency across contracts and invoices.

### Define Basic Data

- **Brands, Models, Colors**: Built-in database with *136 car brands* and *2357 car models*.
- Add new or update existing entries with minimal required fields (e.g., brand/model/color name).

### Define Cars and Customers

1. **Cars**
    - Register cars with **mandatory** and **optional** fields for generating invoices and contracts.
    - Upload images/documents, filter car lists by status, and switch between gallery and list views.

2. **Customers**
    - Add or update customer data.
    - Customer details are crucial for generating invoices and contracts.

### Create Contracts and Invoices

- Generate various types of contracts:
    - **Commission Agreement (C To C)**
    - **Purchase With Warranty (Stock)**
- Generate invoices:
    - **Netto** / **DFZ** / **Brutto**
- Add or update Cars/Customers while creating a contract or invoice.
- Download contracts and invoices in **PDF format**.
- Cancel or manage existing contracts/invoices from dedicated lists.

### Reports

- **Bank Reports**: Show cars currently in the garage (not invoiced or sold).
- **Dynamic Car Reports (Stock Cars)**: Customize fields to include in the report, fitting into an A4 PDF page.
- Valuable for inventory status and sales performance metrics.

---

## Database and Schemas

### Creation

- A MongoDB-based database design using schemas tailored for car dealerships.
- Primary collections include **Car**, **Customer**, **User**, **Deal**, **Invoices**, **Contracts**, **Brands**, **Models**, **Colors**, and more.

### Car Schema Example

- Uses Mongoose to define fields like `brand`, `model`, `color`, references to other collections (`ObjectId` type).
- Includes timestamps (`createdAt`, `updatedAt`) and custom logic for date validations.

> **Other Schemas** (Brand, Color, Model, Customer, Invoices, PurcheseWithWarranty, ComissionAgreement, BaseInfo, Deal, Logs, etc.) follow a similar Mongoose-based structure.

---

## System Design Analysis

1. **Requirement Gathering**
    - Consulted with individuals experienced in car dealership processes to define necessary features and data points.

2. **Architecture**
    - **Modular Approach**: Separated backend (Node.js + Express) and frontend (Next.js/React).
    - **Database Interaction**: Mongoose for MongoDB.
    - **Key Features**: Inventory management, customer management, sales/contract functionalities.

---

## Backend Development

1. **Authentication**
    - Implemented with **JWT tokens** (JSON Web Tokens).
    - Secures endpoints and verifies user roles/permissions.

2. **Data Management**
    - **Controllers** handle business logic for Brands, Models, Colors, Cars, Customers, Contracts, and Invoices.
    - **Routers** map HTTP routes to their corresponding controllers.

3. **Mongoose Models**
    - One schema per data entity (Car, Brand, Color, Model, User, Invoice, etc.).
    - Maintains relationships via **ObjectId** references.

---

## Frontend Development

1. **Framework & UI**
    - **Next.js** for server-side rendering and file-based routing.
    - **React** for building reusable UI components.
    - **Material-UI** and an **AdMASH** template for consistent design and layout.

2. **Project Structure**
    - `_app.js` serves as the root for Next.js, integrating **Redux** and global styles.
    - Pages placed in the `pages/` directory, with corresponding styles in `.module.css` files.
    - Reusable UI components in the `components/` directory.

3. **State Management**
    - **Redux Toolkit** for centralizing state (e.g., car data, color data, brand data).
    - Slices (`carEndpoint`, `colorEndpoint`, etc.) handle actions and reducers for each feature.
    - Combined in `store.js`.

4. **Key Frontend Highlights**
    - **Car Component**: Form validations, image/document uploads (via `react-dropzone`), autocomplete fields for brand/model/color.
    - Similar patterns apply to other modules (Customers, Contracts, Invoices).

---

## Tech Stack

**Frontend**
- **React**: Core UI library.
- **Next.js**: Server-side rendering and routing.
- **Material-UI**: Prebuilt UI components following Material Design.
- **Redux / Redux Toolkit**: State management.
- **CSS3**: Styling and layout.

**Backend**
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.

**Database**
- **MongoDB**: NoSQL database with flexible document-based structure.

**Deployment & Infrastructure**
- **Docker / Docker Compose**: Containerize frontend, backend, and database for consistent environment.

**Tools**
- **VS Code**: Source code editing.
- **MongoDB Compass**: Visual DB management.
- **AI Logo/Photo Generator**: Creating images or logos.
- **ChatGPT**: Assistance with text generation and project documentation.

---

## Getting Started

 **Clone the Repository**
   ```bash
   git clone https://github.com/YourUsername/drivezy-mix.git
   cd drivezy-mix
```markdown
## Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Set Up Environment Variables

Create `.env` files for both backend and frontend with the required configuration (e.g., **MongoDB connection strings**, **JWT secrets**).

## Run the Application

### Backend
```bash
npm run dev
```

### Frontend
```bash
npm run dev
```
Access the application at [http://localhost:3000/](http://localhost:3000/).

## Login
Use the demo credentials:
- **User**: `parsa@akbari.com`
- **Password**: `123456`

## Authors
- **Parsa Akbari**
- **Mohammad Lnan Loo**
- **Sina Boromand**

## License
This project is licensed under the [MIT License](LICENSE).

**Thank you for using Drivezy Mix!**  
If you have any questions or feedback, feel free to open an issue in this repository or contact the contributors directly.

---

### How to Download

1. **Copy** the code block above (including the opening and closing triple backticks).
2. **Paste** it into a file named `README.md` in your repository or local folder.
3. **Commit** and push the file to your GitHub repository if desired.

Now you have a complete, ready-to-use `README.md` file. Enjoy!
```
