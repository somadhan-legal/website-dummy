# Analytics Setup & Dashboard Guide for Somadhan

This guide explains how to access your data and build the specific dashboards (Explorations) you asked for using Google Analytics 4 (GA4).

---

## 1. Where to Find Your Data

Once your site is live and people visit it, data will start appearing here:

### **Real-Time Data (What's happening NOW)**
- Go to **Reports** (icon on left) → **Realtime**.
- You will see:
  - Users on site right now.
  - Which pages they are viewing.
  - Events they are triggering (e.g., `waitlist_opened`).

### **General Engagement (Historical Data)**
- Go to **Reports** → **Engagement** → **Events**.
- Here you will see a list of all events (e.g., `page_view`, `click`, `waitlist_submit_success`) and how many times they happened.

---

## 2. How to Create "Explorations" (Custom Dashboards)

To get detailed insights like "Funnel Conversion" or "Drop-off", you need to use the **Explore** tab.

### **A. Waitlist Funnel Conversion (Step-by-Step Flow)**
*This shows how many people start the form vs. how many finish it.*

1. Click **Explore** (compass icon on left).
2. Click **"Funnel exploration"**.
3. In **Settings** (right column), look for **"Steps"** and click the pencil icon to edit.
4. Add these steps:
   - **Step 1:** Name it "Opened Form". Condition: `waitlist_opened`.
   - **Step 2:** Name it "Contact Info". Condition: `waitlist_step_complete` (Add parameter filter: `step_name` contains `contact_info`).
   - **Step 3:** Name it "Profession". Condition: `waitlist_step_complete` (filter: `step_name` contains `profession`).
   - **Step 4:** Name it "Services". Condition: `waitlist_step_complete` (filter: `step_name` contains `services`).
   - **Step 5:** Name it "Heard From". Condition: `waitlist_step_complete` (filter: `step_name` contains `heard_from`).
   - **Step 6:** Name it "Submitted". Condition: `waitlist_submit_success`.
5. Click **Apply**.
6. **Result:** You will see a bar chart showing exactly where users drop off.

### **B. Drop-off Analysis**
*The Funnel Exploration above automatically shows drop-off rates.*
- Look at the **"% Abandonment"** number between columns.
- **Example:** If 100 people open the form but only 50 complete "Contact Info", you have a 50% drop-off at Step 1.

### **C. Traffic Sources (Where are they coming from?)**
*Find out if users come from Google, Facebook, or Direct links.*

1. Click **Explore** → **"Blank"**.
2. In **Variables** (left column), click `+` next to **Dimensions**. Search and select:
   - `Session source`
   - `Session medium`
3. Click `+` next to **Metrics**. Select:
   - `Active users`
   - `Sessions`
   - `Key events` (conversions)
4. **Drag and Drop:**
   - Drag `Session source` to **Rows**.
   - Drag `Active users` to **Values**.
5. **Result:** A table showing which sources bring the most users.

### **D. Device Breakdown**
*Are users on Mobile or Desktop?*

1. Create a new **"Blank"** exploration.
2. Add Dimension: `Device category`.
3. Add Metric: `Active users`.
4. Drag `Device category` to **Rows** and `Active users` to **Values**.
5. **Result:** A breakdown of Mobile vs. Desktop vs. Tablet users.

---

## 3. Interpreting the Data

| **Metric** | **Good Sign** | **Bad Sign** |
|------------|--------------|--------------|
| **Engagement Rate** | > 50% (Users stay and interact) | < 30% (Users leave immediately) |
| **Funnel Completion** | > 20% (1 in 5 users submit) | < 5% (Form might be too long or broken) |
| **Top Source** | Diverse mix (Social, Search, Direct) | Only "Direct" (Means tracking might be missed) |

---

## 4. Need Help?
If you provide me with access to your GA4 property (add `somadhan.legal@gmail.com` as a user), I can set these up for you. For now, following the steps above will get you 90% of the way there!
