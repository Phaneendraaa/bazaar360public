# Bazaar360 Admin Dashboard Operating Guide

Welcome to the **Bazaar360 Admin Portal**. This guide provides step-by-step instructions on accessing, navigating, and operating your e-commerce management panel.

---

## 1. Accessing the Dashboard

1. **Dashboard URL**: Open your browser and navigate to `http://localhost:3000/admin` (or your production website URL followed by `/admin`).
2. **Default Login Credentials**:
   - **Username**: `admin`
   - **Password**: `admin1234`
3. Click the **Login** button. Your session is secured via an HTTP-only JWT Cookie.

---

## 2. Navigating the Dashboard

The dashboard is split into three main modules accessible via the top navigation tabs:
- **Orders**: Monitor incoming Cash on Delivery (COD) shoppers.
- **Products**: Add, edit, or delete items in your catalog.
- **Reviews**: Manually write customer reviews with images.

The tabs dynamically scale and scroll horizontally on mobile screens for ease of use.

---

## 3. Order Management

The **Orders** tab shows a real-time list of customer purchases.

### How to Operate:
* **Search & Filters**:
  - Use the search bar to find orders instantly by **Customer Name**, **Phone Number**, or **Order Number** (e.g., `BZ-XXXXXX`).
  - Filter orders using the **All Statuses** dropdown (Pending, Confirmed, Shipped, Delivered, Cancelled).
* **Updating Order Status**:
  - Click the status dropdown on any order card/row to change its progress.
  - **Prisma stock recovery logic**: If you set an order to `CANCELLED`, the system automatically increments the catalog stock back for those items.
* **Exporting Orders**:
  - Click the **Export CSV** button in the filter bar to download a `.csv` spreadsheet containing comprehensive billing details, addresses, product quantities, and delivery notes.

---

## 4. Product Catalog Controls

The **Products** tab manages items listed on the public storefront.

### Currency Standard:
> [!IMPORTANT]
> **Currency is configured in Indian Rupees (₹ / INR)**.
> All pricing fields in the admin dashboard expect whole rupee numbers (e.g., enter `1499` for ₹1,499). Do not enter dollar signs or decimal dots unless necessary.

### Adding or Editing a Product:
1. Click **Add Product** (or the **Edit** icon next to an existing product).
2. Fill out the fields:
   - **Product Title**: Name of the item shown on the catalog.
   - **SKU Code**: Unique ID for the stock keeping unit (e.g., `WCP-15W-SLV`).
   - **Stock Inventory**: Available count. The site displays "Only X items left!" if the count falls to 10 or below.
   - **Selling Price (₹)**: Active sale price in Rupees (e.g., `1499`).
   - **Original Price (₹)**: Higher price for cross-out discount displays (e.g., `2999`).
3. **Upload Media Files**:
   - Click **Upload Image/Video** to select image files or a video clip.
   - Images are uploaded via our dual storage endpoint. If Cloudinary credentials are not present in `.env`, the server automatically saves them under the local `public/uploads` directory.
   - You can review thumbnails of uploaded media and click `X` on any thumbnail to remove it.
4. **Highlights & Specs**:
   - Write structured technical bullets and specifications in the description text field.
5. Click **Submit** to publish or update the catalog immediately.

---

## 5. Review Creation with Images

The **Reviews** tab allows you to manually add realistic customer reviews to any product to boost conversion.

### How to Operate:
1. **Select a Product**: Select the desired item from the product dropdown.
2. **Review Details**:
   - **Customer Name**: Name of the reviewer (e.g., `Rohan S.`).
   - **Rating Stars**: Click on the star graphics to rate between 1 and 5 stars.
   - **Review Comments**: Write feedback commentary.
3. **Review Photos**:
   - Click **Upload Photos** to select one or more image files.
   - Previews will generate as small thumbnail cards. Click `X` on any thumbnail if you want to discard it.
4. Click **Submit Review**. The review will instantly appear under the customer reviews section on the public product page!

---

## 6. Local Server Maintenance

To start the website locally:
```bash
npm run dev
```
If you make changes to the Prisma schema or want to clear existing data and reset to seed standards:
```bash
# Push database structures and run the seed script
npm run db:setup
```
This reset seeds products with default prices set in Indian Rupees (₹).
