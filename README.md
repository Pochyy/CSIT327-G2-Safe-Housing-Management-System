# Safe Haven — Safe Housing Management System


## Project Overview
**Safe Haven** is a web-based safe housing finder platform designed to improve **safety**, **reliability**, and **transparency** in rental accommodations. It enables tenants and landlords to connect through verified listings, advanced search filters, and a mutual rating system that promotes trust and accountability.

### Primary Objective
To design, develop, and launch a platform that provides users with a secure and trustworthy way to find and manage rental housing.

### Specific Objectives
- Launch a platform with verified listings, search filters, and a rating system.  
- Allow users to search and filter rental options by budget, amenities, and location.  
- Enable tenants and landlords to rate each other to build trust and accountability.  
- Provide a dashboard for landlords to manage listings and monitor applications.

---

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Django Framework)  
- **Database:** MySQL  
- **Version Control:** Git & GitHub

---

## Installation & Setup

### Prerequisites
- Python 3.10+  
- MySQL Server  
- Git  
- Virtual environment (recommended)

### Steps
1. **Clone the repository**  
   ```bash
   git clone https://github.com/Pochyy/Safe_Housing_Management_System.git
   cd CSIT327-G2-Safe-Housing-Management-System
2. **Set up virtual environment**
   ```bash
   python -m venv .env
   .env\Scripts\activate         # Windows
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
4. **Configure environment variables**
    - Create a .env file in the project root
    -  Add your database credentials and secret key

5. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
6. **Run the server**
   ```bash
   python manage.py runserver

  >Then open http://localhost:8000 in your browser.

---

## Usage
- Login / Register: Users can create accounts as either tenants or landlords.
- Search Listings: Use filters to find safe, verified rental options by location, price, or amenities.
- Rate & Review: Tenants and landlords can rate each other to build trust.
- Dashboard: Landlords can post, update, and manage their property listings.
- Security: Passwords are encrypted, and listings undergo verification.

---

## Contributing
We welcome contributions from fellow developers and testers.

To contribute:

1. Fork the repository
2. Create a new branch (git checkout -b feature-name)
3. Commit your changes (git commit -m "Add feature")
4. Push to your fork (git push origin feature-name)
5. Submit a pull request

Guidelines:
- Follow PEP 8 coding standards
- Keep commit messages clear
- Add comments to explain your code if needed

---

## License
This project is licensed for academic use only.
Feel free to reference and learn from it, but not for commercial distribution.

---

## Authors & Acknowledgments
- Full Stack – Natasha Kate A. Leonardo
- Backend – Vinzent Emmanuel M. Lariosa
- Frontend – Hilary Danne C. Lao

Special thanks to our mentors, Mr. Frederick L Revilleza Jr. and Mr. Joemarie C. Amparo, and open-source communities for their resources and support.

---

## Known Issues / Future Enhancements
- Email verification still in development
- Improve UI responsiveness for mobile users
- Integrate location map for listings
- Automated fraud/scam detection system (future)

---

## Contact & Support
For questions, suggestions, or issues:

Send a message to leonardonatashakate@gmail.com

