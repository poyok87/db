const lessons = [
  {
    title: "Store Orders",
    category: "Sales & customers",
    icon: "◫",
    headline: "Turn one crowded order sheet into a reliable database.",
    context: "A store records the customer and every product in one row. Product lists are hard to search, while customer and product details repeat.",
    quiz: {
      question: "Why should CustomerName leave the ORDER table in 3NF?",
      answer: "CustomerName depends on CustomerID, not directly on OrderID. That makes it a transitive dependency."
    },
    stages: [
      {
        label: "RAW",
        name: "Unorganized Table",
        description: "The spreadsheet mixes an order, its customer, and a repeating list of products in a single record.",
        ruleCaption: "CURRENT PROBLEM",
        rule: "Repeating groups and non-atomic values",
        dependency: "Products = {product, quantity, price} × many",
        action: "Identify the repeating group",
        before: "Products contains several values in one cell",
        after: "Each product must become its own row",
        tables: [
          { name: "ORDER_SHEET", note: "Unorganized source", columns: ["OrderID", "Date", "CustomerID", "CustomerName", "Products"], rows: [["O-104", "12 Aug", "C-07", "Maya", "Coffee ×2 @ 12; Cake ×1 @ 18"]], problemColumns: [4] }
        ]
      },
      {
        label: "1NF",
        name: "Atomic Values",
        description: "Split the product list so every cell holds one value and every order item has its own row.",
        ruleCaption: "FIRST NORMAL FORM",
        rule: "One cell, one value; no repeating groups",
        dependency: "(OrderID, ProductID) → Quantity",
        action: "Repeating list → individual rows",
        before: "Coffee and Cake share one Products cell",
        after: "Coffee and Cake occupy separate rows",
        tables: [
          { name: "ORDER_1NF", note: "Composite primary key", columns: [{name:"OrderID",key:"PK"},{name:"ProductID",key:"PK"},"Date","CustomerID","CustomerName","ProductName","Price","Quantity"], rows: [["O-104","P-08","12 Aug","C-07","Maya","Coffee","12","2"],["O-104","P-11","12 Aug","C-07","Maya","Cake","18","1"]] }
        ]
      },
      {
        label: "2NF",
        name: "Full-Key Dependency",
        description: "Move attributes that depend on only part of the composite key into their own tables.",
        ruleCaption: "SECOND NORMAL FORM",
        rule: "Every non-key attribute depends on the whole key",
        dependency: "ProductID → ProductName, Price",
        action: "Remove partial dependencies",
        before: "Product price repeats in every order",
        after: "PRODUCT stores each price once",
        tables: [
          { name: "ORDER", note: "Order facts", columns: [{name:"OrderID",key:"PK"},"Date","CustomerID","CustomerName"], rows: [["O-104","12 Aug","C-07","Maya"]] },
          { name: "PRODUCT", note: "Product facts", columns: [{name:"ProductID",key:"PK"},"ProductName","Price"], rows: [["P-08","Coffee","12"],["P-11","Cake","18"]] },
          { name: "ORDER_ITEM", note: "Relationship", columns: [{name:"OrderID",key:"PK/FK"},{name:"ProductID",key:"PK/FK"},"Quantity"], rows: [["O-104","P-08","2"],["O-104","P-11","1"]] }
        ]
      },
      {
        label: "3NF",
        name: "Direct Dependency",
        description: "Move customer details out because the customer name is determined by CustomerID, not by OrderID.",
        ruleCaption: "THIRD NORMAL FORM",
        rule: "No non-key attribute depends on another non-key attribute",
        dependency: "OrderID → CustomerID → CustomerName",
        action: "Remove transitive dependencies",
        before: "CustomerName repeats across orders",
        after: "CUSTOMER becomes the single source of truth",
        tables: [
          { name: "CUSTOMER", note: "Customer source", columns: [{name:"CustomerID",key:"PK"},"CustomerName"], rows: [["C-07","Maya"]] },
          { name: "ORDER", note: "Transaction", columns: [{name:"OrderID",key:"PK"},"Date",{name:"CustomerID",key:"FK"}], rows: [["O-104","12 Aug","C-07"]] },
          { name: "PRODUCT", note: "Catalog", columns: [{name:"ProductID",key:"PK"},"ProductName","Price"], rows: [["P-08","Coffee","12"]] },
          { name: "ORDER_ITEM", note: "Line items", columns: [{name:"OrderID",key:"PK/FK"},{name:"ProductID",key:"PK/FK"},"Quantity"], rows: [["O-104","P-08","2"]] }
        ]
      }
    ]
  },
  {
    title: "Course Enrollment",
    category: "Education",
    icon: "△",
    headline: "Organize a semester of students, courses, and lecturers.",
    context: "A student can take many courses. Student, course, and lecturer details repeat when they are stored in one enrollment sheet.",
    quiz: {
      question: "Where should LecturerName be stored in 3NF?",
      answer: "In LECTURER, because LecturerName depends on LecturerID rather than on CourseID."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "One student row contains a list of courses, grades, and lecturers. The repeating group cannot be queried reliably.",
        ruleCaption: "CURRENT PROBLEM", rule: "Courses form a repeating group", dependency: "Courses = {CourseID, Grade, Lecturer} × many",
        action: "Find the repeated course bundle", before: "Courses stores DB101:A and UX204:B+ together", after: "Each enrollment needs a separate row",
        tables: [{ name: "SEMESTER_SHEET", note: "Unorganized source", columns: ["StudentID","StudentName","Courses"], rows: [["S-21","Aisha","DB101 | Databases | A | L-04 Dr. Lim; UX204 | UX Design | B+ | L-09 Prof. Tan"]], problemColumns: [2] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Create one row per student-course pair so every grade and identifier becomes an atomic value.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One enrollment per row", dependency: "(StudentID, CourseID) → Grade",
        action: "Course list → enrollment rows", before: "Two courses share one cell", after: "DB101 and UX204 have separate records",
        tables: [{ name: "ENROLLMENT_1NF", note: "Composite primary key", columns: [{name:"StudentID",key:"PK"},{name:"CourseID",key:"PK"},"StudentName","CourseName","LecturerID","LecturerName","Grade"], rows: [["S-21","DB101","Aisha","Databases","L-04","Dr. Lim","A"],["S-21","UX204","Aisha","UX Design","L-09","Prof. Tan","B+"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "StudentName depends only on StudentID, while course and lecturer details depend only on CourseID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove dependencies on part of the key", dependency: "StudentID → StudentName",
        action: "Separate students and courses", before: "StudentName repeats for every course", after: "STUDENT stores the name once",
        tables: [
          { name: "STUDENT", note: "Student profile", columns: [{name:"StudentID",key:"PK"},"StudentName"], rows: [["S-21","Aisha"]] },
          { name: "COURSE", note: "Course facts", columns: [{name:"CourseID",key:"PK"},"CourseName","LecturerID","LecturerName"], rows: [["DB101","Databases","L-04","Dr. Lim"]] },
          { name: "ENROLLMENT", note: "Relationship", columns: [{name:"StudentID",key:"PK/FK"},{name:"CourseID",key:"PK/FK"},"Grade"], rows: [["S-21","DB101","A"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "Move lecturer details out of COURSE because LecturerName is determined by LecturerID.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Remove non-key-to-non-key dependencies", dependency: "CourseID → LecturerID → LecturerName",
        action: "Create a lecturer entity", before: "LecturerName is embedded in COURSE", after: "COURSE keeps only LecturerID as a foreign key",
        tables: [
          { name: "STUDENT", note: "Student profile", columns: [{name:"StudentID",key:"PK"},"StudentName"], rows: [["S-21","Aisha"]] },
          { name: "LECTURER", note: "Teaching staff", columns: [{name:"LecturerID",key:"PK"},"LecturerName"], rows: [["L-04","Dr. Lim"]] },
          { name: "COURSE", note: "Course catalog", columns: [{name:"CourseID",key:"PK"},"CourseName",{name:"LecturerID",key:"FK"}], rows: [["DB101","Databases","L-04"]] },
          { name: "ENROLLMENT", note: "Results", columns: [{name:"StudentID",key:"PK/FK"},{name:"CourseID",key:"PK/FK"},"Grade"], rows: [["S-21","DB101","A"]] }
        ]
      }
    ]
  },
  {
    title: "Clinic Visits",
    category: "Healthcare",
    icon: "+",
    headline: "Separate patient visits from doctors and specialties.",
    context: "A patient may visit the same doctor more than once. Patient profiles and medical specialties should not be copied into every visit.",
    quiz: {
      question: "What identifies one visit in the 1NF table?",
      answer: "The combination PatientID + DoctorID + VisitDate uniquely identifies a visit."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "A patient's entire visit history is typed into one Visits cell, mixing dates, doctors, specialties, and diagnoses.",
        ruleCaption: "CURRENT PROBLEM", rule: "A nested list lives inside one field", dependency: "Visits = {Doctor, Date, Diagnosis} × many",
        action: "Expose each clinical event", before: "Two visits are packed into one cell", after: "Each visit must become one record",
        tables: [{ name: "PATIENT_SHEET", note: "Unorganized source", columns: ["PatientID","PatientName","Visits"], rows: [["PT-08","Noah","D-04 | 15 Jun | Cardiology | Palpitations; D-09 | 20 Jul | General | Flu"]], problemColumns: [2] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Split visit history into rows with one date, one doctor, and one diagnosis per record.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One clinical event per row", dependency: "(PatientID, DoctorID, VisitDate) → Diagnosis",
        action: "Visit history → event rows", before: "Dates and diagnoses share one list", after: "Each date and diagnosis is atomic",
        tables: [{ name: "VISIT_1NF", note: "Composite primary key", columns: [{name:"PatientID",key:"PK"},{name:"DoctorID",key:"PK"},{name:"VisitDate",key:"PK"},"PatientName","DoctorName","SpecialtyID","SpecialtyName","Diagnosis"], rows: [["PT-08","D-04","15 Jun","Noah","Dr. Wong","SP-02","Cardiology","Palpitations"],["PT-08","D-09","20 Jul","Noah","Dr. Chen","SP-01","General","Flu"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "PatientName depends only on PatientID, while doctor details depend only on DoctorID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Profiles do not belong to a visit key", dependency: "DoctorID → DoctorName, SpecialtyID",
        action: "Separate patient and doctor profiles", before: "DoctorName repeats on every visit", after: "DOCTOR stores the profile once",
        tables: [
          { name: "PATIENT", note: "Patient profile", columns: [{name:"PatientID",key:"PK"},"PatientName"], rows: [["PT-08","Noah"]] },
          { name: "DOCTOR", note: "Doctor profile", columns: [{name:"DoctorID",key:"PK"},"DoctorName","SpecialtyID","SpecialtyName"], rows: [["D-04","Dr. Wong","SP-02","Cardiology"]] },
          { name: "VISIT", note: "Clinical event", columns: [{name:"PatientID",key:"PK/FK"},{name:"DoctorID",key:"PK/FK"},{name:"VisitDate",key:"PK"},"Diagnosis"], rows: [["PT-08","D-04","15 Jun","Palpitations"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "SpecialtyName is determined by SpecialtyID, so it belongs in a shared specialty reference table.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Reference data has one source", dependency: "DoctorID → SpecialtyID → SpecialtyName",
        action: "Extract the specialty lookup", before: "Cardiology repeats for many doctors", after: "SPECIALTY maps each ID to one name",
        tables: [
          { name: "PATIENT", note: "Patient profile", columns: [{name:"PatientID",key:"PK"},"PatientName"], rows: [["PT-08","Noah"]] },
          { name: "SPECIALTY", note: "Reference data", columns: [{name:"SpecialtyID",key:"PK"},"SpecialtyName"], rows: [["SP-02","Cardiology"]] },
          { name: "DOCTOR", note: "Medical staff", columns: [{name:"DoctorID",key:"PK"},"DoctorName",{name:"SpecialtyID",key:"FK"}], rows: [["D-04","Dr. Wong","SP-02"]] },
          { name: "VISIT", note: "Clinical event", columns: [{name:"PatientID",key:"PK/FK"},{name:"DoctorID",key:"PK/FK"},{name:"VisitDate",key:"PK"},"Diagnosis"], rows: [["PT-08","D-04","15 Jun","Palpitations"]] }
        ]
      }
    ]
  },
  {
    title: "Library Loans",
    category: "Books & members",
    icon: "▤",
    headline: "Give every book, member, and publisher a proper home.",
    context: "A loan sheet often combines member data, a list of books, and publisher details, causing titles and publisher names to repeat.",
    quiz: {
      question: "Why does PublisherID remain in BOOK after 3NF?",
      answer: "It is the foreign key that connects each book to its publisher, while publisher attributes move to PUBLISHER."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "The BorrowedBooks field contains several books and due dates, creating an embedded repeating group.",
        ruleCaption: "CURRENT PROBLEM", rule: "Multiple book records share one cell", dependency: "BorrowedBooks = {BookID, DueDate} × many",
        action: "Locate the repeating book list", before: "B-12 and B-35 are stored together", after: "Each borrowed book needs its own row",
        tables: [{ name: "LOAN_SHEET", note: "Unorganized source", columns: ["MemberID","MemberName","LoanDate","BorrowedBooks"], rows: [["M-17","Liam","02 Aug","B-12 Clean Code due 16 Aug; B-35 Data Design due 16 Aug"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Create one row for each member-book-date combination, with one due date in each cell.",
        ruleCaption: "FIRST NORMAL FORM", rule: "No lists inside columns", dependency: "(MemberID, BookID, LoanDate) → DueDate",
        action: "Book list → loan rows", before: "Two books share BorrowedBooks", after: "Each book becomes a loan record",
        tables: [{ name: "LOAN_1NF", note: "Composite primary key", columns: [{name:"MemberID",key:"PK"},{name:"BookID",key:"PK"},{name:"LoanDate",key:"PK"},"MemberName","BookTitle","PublisherID","PublisherName","DueDate"], rows: [["M-17","B-12","02 Aug","Liam","Clean Code","PB-03","North Press","16 Aug"],["M-17","B-35","02 Aug","Liam","Data Design","PB-07","River Books","16 Aug"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "MemberName depends only on MemberID, while book and publisher information depends only on BookID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Use the whole composite key", dependency: "BookID → BookTitle, PublisherID",
        action: "Separate members and books", before: "BookTitle repeats every time the book is loaned", after: "BOOK stores the title once",
        tables: [
          { name: "MEMBER", note: "Member profile", columns: [{name:"MemberID",key:"PK"},"MemberName"], rows: [["M-17","Liam"]] },
          { name: "BOOK", note: "Book catalog", columns: [{name:"BookID",key:"PK"},"BookTitle","PublisherID","PublisherName"], rows: [["B-12","Clean Code","PB-03","North Press"]] },
          { name: "LOAN", note: "Transaction", columns: [{name:"MemberID",key:"PK/FK"},{name:"BookID",key:"PK/FK"},{name:"LoanDate",key:"PK"},"DueDate"], rows: [["M-17","B-12","02 Aug","16 Aug"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "PublisherName depends on PublisherID and therefore moves out of the BOOK table.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Store each independent entity once", dependency: "BookID → PublisherID → PublisherName",
        action: "Create a publisher entity", before: "PublisherName is copied across books", after: "BOOK references PUBLISHER with a foreign key",
        tables: [
          { name: "MEMBER", note: "Member profile", columns: [{name:"MemberID",key:"PK"},"MemberName"], rows: [["M-17","Liam"]] },
          { name: "PUBLISHER", note: "Publisher source", columns: [{name:"PublisherID",key:"PK"},"PublisherName"], rows: [["PB-03","North Press"]] },
          { name: "BOOK", note: "Book catalog", columns: [{name:"BookID",key:"PK"},"BookTitle",{name:"PublisherID",key:"FK"}], rows: [["B-12","Clean Code","PB-03"]] },
          { name: "LOAN", note: "Transaction", columns: [{name:"MemberID",key:"PK/FK"},{name:"BookID",key:"PK/FK"},{name:"LoanDate",key:"PK"},"DueDate"], rows: [["M-17","B-12","02 Aug","16 Aug"]] }
        ]
      }
    ]
  },
  {
    title: "Freelance Projects",
    category: "Work & clients",
    icon: "◇",
    headline: "Untangle projects, freelancers, and client records.",
    context: "A project can involve several freelancers. Client details, project names, and hourly rates should not live inside every time entry.",
    quiz: {
      question: "Which key determines HoursWorked?",
      answer: "ProjectID + FreelancerID, because the hours describe one freelancer's assignment to one project."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "A TeamAndHours cell combines each freelancer with a rate and number of hours.",
        ruleCaption: "CURRENT PROBLEM", rule: "People and hours repeat inside one field", dependency: "TeamAndHours = {Freelancer, Rate, Hours} × many",
        action: "Find the team repeating group", before: "Aina: 12h and Ravi: 8h share one cell", after: "Each assignment needs a record",
        tables: [{ name: "PROJECT_SHEET", note: "Unorganized source", columns: ["ProjectID","ProjectName","ClientID","ClientName","TeamAndHours"], rows: [["PR-09","Mobile Redesign","CL-03","Orbit Co.","F-11 Aina @ 60 × 12h; F-18 Ravi @ 75 × 8h"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Turn each project-freelancer assignment into a row with atomic rate and hour values.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One assignment per row", dependency: "(ProjectID, FreelancerID) → HoursWorked",
        action: "Team list → assignment rows", before: "Several workers share TeamAndHours", after: "Every worker has one project row",
        tables: [{ name: "ASSIGNMENT_1NF", note: "Composite primary key", columns: [{name:"ProjectID",key:"PK"},{name:"FreelancerID",key:"PK"},"ProjectName","ClientID","ClientName","FreelancerName","HourlyRate","HoursWorked"], rows: [["PR-09","F-11","Mobile Redesign","CL-03","Orbit Co.","Aina","60","12"],["PR-09","F-18","Mobile Redesign","CL-03","Orbit Co.","Ravi","75","8"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "Project facts depend only on ProjectID; freelancer name and rate depend only on FreelancerID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Put attributes with their complete determinant", dependency: "FreelancerID → FreelancerName, HourlyRate",
        action: "Separate projects and freelancers", before: "HourlyRate repeats for each project", after: "FREELANCER stores the current rate",
        tables: [
          { name: "PROJECT", note: "Project facts", columns: [{name:"ProjectID",key:"PK"},"ProjectName","ClientID","ClientName"], rows: [["PR-09","Mobile Redesign","CL-03","Orbit Co."]] },
          { name: "FREELANCER", note: "Talent profile", columns: [{name:"FreelancerID",key:"PK"},"FreelancerName","HourlyRate"], rows: [["F-11","Aina","60"]] },
          { name: "ASSIGNMENT", note: "Relationship", columns: [{name:"ProjectID",key:"PK/FK"},{name:"FreelancerID",key:"PK/FK"},"HoursWorked"], rows: [["PR-09","F-11","12"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "ClientName depends on ClientID, so client details move out of PROJECT.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Independent entities get independent tables", dependency: "ProjectID → ClientID → ClientName",
        action: "Extract the client entity", before: "ClientName repeats across projects", after: "PROJECT stores only ClientID",
        tables: [
          { name: "CLIENT", note: "Client source", columns: [{name:"ClientID",key:"PK"},"ClientName"], rows: [["CL-03","Orbit Co."]] },
          { name: "PROJECT", note: "Project facts", columns: [{name:"ProjectID",key:"PK"},"ProjectName",{name:"ClientID",key:"FK"}], rows: [["PR-09","Mobile Redesign","CL-03"]] },
          { name: "FREELANCER", note: "Talent profile", columns: [{name:"FreelancerID",key:"PK"},"FreelancerName","HourlyRate"], rows: [["F-11","Aina","60"]] },
          { name: "ASSIGNMENT", note: "Time record", columns: [{name:"ProjectID",key:"PK/FK"},{name:"FreelancerID",key:"PK/FK"},"HoursWorked"], rows: [["PR-09","F-11","12"]] }
        ]
      }
    ]
  },
  {
    title: "Hotel Bookings",
    category: "Hospitality",
    icon: "⌂",
    headline: "Make room for clean booking data.",
    context: "One booking may include several rooms. Guest, hotel, room type, and nightly rate details should not repeat in each booking item.",
    quiz: {
      question: "What does BOOKING_ROOM represent after 3NF?",
      answer: "It connects a booking to a room and stores facts about that relationship, such as NumberOfNights."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "The Rooms field combines room numbers, types, rates, and nights for one booking.",
        ruleCaption: "CURRENT PROBLEM", rule: "Room bundles repeat inside one cell", dependency: "Rooms = {RoomID, Type, Rate, Nights} × many",
        action: "Identify each booked room", before: "Rooms 301 and 305 share one field", after: "Every booked room needs a separate record",
        tables: [{ name: "BOOKING_SHEET", note: "Unorganized source", columns: ["BookingID","GuestID","GuestName","HotelID","HotelName","Rooms"], rows: [["BK-42","G-05","Emma","H-02","Harbor Hotel","301 Deluxe @ 180 × 2 nights; 305 Twin @ 130 × 1 night"]], problemColumns: [5] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Split the room list so one row represents one room inside one booking.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One booked room per row", dependency: "(BookingID, RoomID) → NumberOfNights",
        action: "Room list → booking items", before: "Room attributes are packed together", after: "Room and night values become atomic",
        tables: [{ name: "BOOKING_1NF", note: "Composite primary key", columns: [{name:"BookingID",key:"PK"},{name:"RoomID",key:"PK"},"GuestID","GuestName","HotelID","HotelName","RoomType","NightlyRate","NumberOfNights"], rows: [["BK-42","R-301","G-05","Emma","H-02","Harbor Hotel","Deluxe","180","2"],["BK-42","R-305","G-05","Emma","H-02","Harbor Hotel","Twin","130","1"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "Room type, rate, and hotel depend only on RoomID, while guest and date facts depend only on BookingID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Room facts do not depend on the whole booking key", dependency: "RoomID → RoomType, NightlyRate, HotelID",
        action: "Separate bookings and rooms", before: "Room rates repeat across bookings", after: "ROOM stores type and rate once",
        tables: [
          { name: "BOOKING", note: "Booking header", columns: [{name:"BookingID",key:"PK"},"GuestID","GuestName","CheckInDate"], rows: [["BK-42","G-05","Emma","12 Aug"]] },
          { name: "ROOM", note: "Room inventory", columns: [{name:"RoomID",key:"PK"},"HotelID","HotelName","RoomType","NightlyRate"], rows: [["R-301","H-02","Harbor Hotel","Deluxe","180"]] },
          { name: "BOOKING_ROOM", note: "Relationship", columns: [{name:"BookingID",key:"PK/FK"},{name:"RoomID",key:"PK/FK"},"NumberOfNights"], rows: [["BK-42","R-301","2"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "GuestName and HotelName are determined by their own IDs, so each becomes a separate entity.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Every entity has its own identity", dependency: "RoomID → HotelID → HotelName",
        action: "Extract guest and hotel data", before: "Guest and hotel names repeat", after: "BOOKING and ROOM keep foreign keys",
        tables: [
          { name: "GUEST", note: "Guest profile", columns: [{name:"GuestID",key:"PK"},"GuestName"], rows: [["G-05","Emma"]] },
          { name: "HOTEL", note: "Property", columns: [{name:"HotelID",key:"PK"},"HotelName"], rows: [["H-02","Harbor Hotel"]] },
          { name: "BOOKING", note: "Transaction", columns: [{name:"BookingID",key:"PK"},{name:"GuestID",key:"FK"},"CheckInDate"], rows: [["BK-42","G-05","12 Aug"]] },
          { name: "ROOM", note: "Inventory", columns: [{name:"RoomID",key:"PK"},{name:"HotelID",key:"FK"},"RoomType","NightlyRate"], rows: [["R-301","H-02","Deluxe","180"]] },
          { name: "BOOKING_ROOM", note: "Booking items", columns: [{name:"BookingID",key:"PK/FK"},{name:"RoomID",key:"PK/FK"},"NumberOfNights"], rows: [["BK-42","R-301","2"]] }
        ]
      }
    ]
  },
  {
    title: "Warehouse Inventory",
    category: "Logistics",
    icon: "▦",
    headline: "Track every product in every warehouse accurately.",
    context: "The same product can be stored in many warehouses. Warehouse location and supplier details should not repeat in every stock row.",
    quiz: {
      question: "Why does Quantity remain in WAREHOUSE_STOCK?",
      answer: "Quantity depends on the combination WarehouseID + ProductID, not on either identifier alone."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "One warehouse row contains a list of products, suppliers, and quantities.",
        ruleCaption: "CURRENT PROBLEM", rule: "Inventory items form a repeating group", dependency: "StockList = {Product, Supplier, Quantity} × many",
        action: "Identify product-stock bundles", before: "P-10 and P-22 share StockList", after: "Each warehouse-product pair needs a row",
        tables: [{ name: "WAREHOUSE_SHEET", note: "Unorganized source", columns: ["WarehouseID","WarehouseName","Postcode","City","StockList"], rows: [["W-03","West Hub","11700","George Town","P-10 Keyboard | S-08 KeyWorks | 45; P-22 Mouse | S-02 ClickLab | 18"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Create one record for each warehouse-product pair and store one quantity value per cell.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One stock item per row", dependency: "(WarehouseID, ProductID) → Quantity",
        action: "Stock list → inventory rows", before: "Several products share one field", after: "Every product gets one stock row",
        tables: [{ name: "STOCK_1NF", note: "Composite primary key", columns: [{name:"WarehouseID",key:"PK"},{name:"ProductID",key:"PK"},"WarehouseName","Postcode","City","ProductName","SupplierID","SupplierName","Quantity"], rows: [["W-03","P-10","West Hub","11700","George Town","Keyboard","S-08","KeyWorks","45"],["W-03","P-22","West Hub","11700","George Town","Mouse","S-02","ClickLab","18"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "Warehouse details depend only on WarehouseID; product and supplier details depend only on ProductID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Only quantity requires both key parts", dependency: "ProductID → ProductName, SupplierID",
        action: "Separate warehouses and products", before: "Names repeat in every stock row", after: "WAREHOUSE_STOCK stores only quantity",
        tables: [
          { name: "WAREHOUSE", note: "Storage location", columns: [{name:"WarehouseID",key:"PK"},"WarehouseName","Postcode","City"], rows: [["W-03","West Hub","11700","George Town"]] },
          { name: "PRODUCT", note: "Catalog", columns: [{name:"ProductID",key:"PK"},"ProductName","SupplierID","SupplierName"], rows: [["P-10","Keyboard","S-08","KeyWorks"]] },
          { name: "WAREHOUSE_STOCK", note: "Stock balance", columns: [{name:"WarehouseID",key:"PK/FK"},{name:"ProductID",key:"PK/FK"},"Quantity"], rows: [["W-03","P-10","45"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "City is determined by Postcode, while SupplierName is determined by SupplierID.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Shared reference facts are stored once", dependency: "ProductID → SupplierID → SupplierName",
        action: "Extract location and supplier references", before: "City and supplier names repeat", after: "LOCATION and SUPPLIER control shared labels",
        tables: [
          { name: "LOCATION", note: "Postcode lookup", columns: [{name:"Postcode",key:"PK"},"City"], rows: [["11700","George Town"]] },
          { name: "SUPPLIER", note: "Supplier source", columns: [{name:"SupplierID",key:"PK"},"SupplierName"], rows: [["S-08","KeyWorks"]] },
          { name: "WAREHOUSE", note: "Storage location", columns: [{name:"WarehouseID",key:"PK"},"WarehouseName",{name:"Postcode",key:"FK"}], rows: [["W-03","West Hub","11700"]] },
          { name: "PRODUCT", note: "Catalog", columns: [{name:"ProductID",key:"PK"},"ProductName",{name:"SupplierID",key:"FK"}], rows: [["P-10","Keyboard","S-08"]] },
          { name: "WAREHOUSE_STOCK", note: "Stock balance", columns: [{name:"WarehouseID",key:"PK/FK"},{name:"ProductID",key:"PK/FK"},"Quantity"], rows: [["W-03","P-10","45"]] }
        ]
      }
    ]
  },
  {
    title: "Streaming Subscriptions",
    category: "Digital product",
    icon: "▷",
    headline: "Clarify users, plans, countries, and subscription history.",
    context: "A user may switch plans over time. User, plan, and country details should not be copied throughout subscription history.",
    quiz: {
      question: "Does CountryName depend directly on UserID?",
      answer: "No. It depends on CountryCode, creating the transitive path UserID → CountryCode → CountryName."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "Plan history is stored as a timeline inside one user row, mixing several subscriptions in one cell.",
        ruleCaption: "CURRENT PROBLEM", rule: "Subscription history is a repeating group", dependency: "PlanHistory = {Plan, StartDate, Status} × many",
        action: "Identify each plan period", before: "Basic@Jan and Premium@Mar share one cell", after: "Each plan change becomes a record",
        tables: [{ name: "USER_SHEET", note: "Unorganized source", columns: ["UserID","UserName","CountryCode","CountryName","PlanHistory"], rows: [["U-31","Sofia","MY","Malaysia","Basic | 01 Jan | Ended; Premium | 01 Mar | Active"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Split plan history by start date so every subscription period is stored in one row.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One plan period per row", dependency: "(UserID, PlanID, StartDate) → Status",
        action: "Timeline → subscription rows", before: "Several plans share PlanHistory", after: "Each plan period is atomic",
        tables: [{ name: "SUBSCRIPTION_1NF", note: "Composite primary key", columns: [{name:"UserID",key:"PK"},{name:"PlanID",key:"PK"},{name:"StartDate",key:"PK"},"UserName","CountryCode","CountryName","PlanName","Price","Status"], rows: [["U-31","PL-01","01 Jan","Sofia","MY","Malaysia","Basic","19","Ended"],["U-31","PL-03","01 Mar","Sofia","MY","Malaysia","Premium","39","Active"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "User details depend only on UserID; plan name and price depend only on PlanID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "History stores relationship facts only", dependency: "PlanID → PlanName, Price",
        action: "Separate users and plans", before: "Plan price repeats for every subscriber", after: "PLAN becomes the pricing source",
        tables: [
          { name: "USER", note: "Account", columns: [{name:"UserID",key:"PK"},"UserName","CountryCode","CountryName"], rows: [["U-31","Sofia","MY","Malaysia"]] },
          { name: "PLAN", note: "Offer", columns: [{name:"PlanID",key:"PK"},"PlanName","Price"], rows: [["PL-03","Premium","39"]] },
          { name: "SUBSCRIPTION", note: "History", columns: [{name:"UserID",key:"PK/FK"},{name:"PlanID",key:"PK/FK"},{name:"StartDate",key:"PK"},"Status"], rows: [["U-31","PL-03","01 Mar","Active"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "CountryName depends on CountryCode and moves into a controlled country reference table.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Codes determine labels in one place", dependency: "UserID → CountryCode → CountryName",
        action: "Extract the country lookup", before: "Malaysia repeats across users", after: "COUNTRY maps MY to Malaysia once",
        tables: [
          { name: "COUNTRY", note: "Reference", columns: [{name:"CountryCode",key:"PK"},"CountryName"], rows: [["MY","Malaysia"]] },
          { name: "USER", note: "Account", columns: [{name:"UserID",key:"PK"},"UserName",{name:"CountryCode",key:"FK"}], rows: [["U-31","Sofia","MY"]] },
          { name: "PLAN", note: "Offer", columns: [{name:"PlanID",key:"PK"},"PlanName","Price"], rows: [["PL-03","Premium","39"]] },
          { name: "SUBSCRIPTION", note: "History", columns: [{name:"UserID",key:"PK/FK"},{name:"PlanID",key:"PK/FK"},{name:"StartDate",key:"PK"},"Status"], rows: [["U-31","PL-03","01 Mar","Active"]] }
        ]
      }
    ]
  },
  {
    title: "Vehicle Workshop",
    category: "Automotive service",
    icon: "◎",
    headline: "Organize service jobs from owners to spare parts.",
    context: "A service job can use many spare parts. Owner, vehicle, and model details should not be repeated on every invoice line.",
    quiz: {
      question: "Why does PlateNumber belong in VEHICLE rather than SERVICE?",
      answer: "PlateNumber describes a vehicle and depends on VehicleID. One vehicle can have many service records."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "The PartsUsed field combines several spare parts, quantities, and prices in one service row.",
        ruleCaption: "CURRENT PROBLEM", rule: "Invoice items repeat inside one field", dependency: "PartsUsed = {PartID, Price, Quantity} × many",
        action: "Identify each invoice line", before: "Oil and Filter share PartsUsed", after: "Each spare part needs its own row",
        tables: [{ name: "SERVICE_SHEET", note: "Unorganized source", columns: ["ServiceID","Customer","Vehicle","Model","PartsUsed"], rows: [["SV-88","C-12 Amir","V-07 WXY1234","MD-05 Civic","PT-01 Oil @ 45 ×1; PT-09 Filter @ 22 ×1"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Create one row for every service-part combination with atomic price and quantity values.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One spare part per invoice row", dependency: "(ServiceID, PartID) → Quantity",
        action: "Parts list → service item rows", before: "Multiple parts share one field", after: "Each part has one invoice record",
        tables: [{ name: "SERVICE_1NF", note: "Composite primary key", columns: [{name:"ServiceID",key:"PK"},{name:"PartID",key:"PK"},"CustomerID","CustomerName","VehicleID","PlateNumber","ModelID","ModelName","PartName","Price","Quantity"], rows: [["SV-88","PT-01","C-12","Amir","V-07","WXY1234","MD-05","Civic","Oil","45","1"],["SV-88","PT-09","C-12","Amir","V-07","WXY1234","MD-05","Civic","Filter","22","1"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "Part name and price depend only on PartID; service and vehicle details depend only on ServiceID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Catalog facts leave invoice lines", dependency: "PartID → PartName, Price",
        action: "Separate services and spare parts", before: "Part price repeats across invoices", after: "SPARE_PART stores catalog price",
        tables: [
          { name: "SERVICE", note: "Workshop job", columns: [{name:"ServiceID",key:"PK"},"VehicleID","PlateNumber","ModelID","ModelName","CustomerID","CustomerName"], rows: [["SV-88","V-07","WXY1234","MD-05","Civic","C-12","Amir"]] },
          { name: "SPARE_PART", note: "Catalog", columns: [{name:"PartID",key:"PK"},"PartName","Price"], rows: [["PT-01","Oil","45"]] },
          { name: "SERVICE_ITEM", note: "Invoice lines", columns: [{name:"ServiceID",key:"PK/FK"},{name:"PartID",key:"PK/FK"},"Quantity"], rows: [["SV-88","PT-01","1"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "Owner and model are reached through the vehicle, so SERVICE should reference only VehicleID.",
        ruleCaption: "THIRD NORMAL FORM", rule: "A service records an event, not profiles", dependency: "ServiceID → VehicleID → ModelID → ModelName",
        action: "Extract vehicle, owner, and model", before: "Owner and model repeat on every service", after: "VEHICLE connects CUSTOMER and MODEL",
        tables: [
          { name: "CUSTOMER", note: "Vehicle owner", columns: [{name:"CustomerID",key:"PK"},"CustomerName"], rows: [["C-12","Amir"]] },
          { name: "MODEL", note: "Model reference", columns: [{name:"ModelID",key:"PK"},"ModelName"], rows: [["MD-05","Civic"]] },
          { name: "VEHICLE", note: "Asset", columns: [{name:"VehicleID",key:"PK"},"PlateNumber",{name:"ModelID",key:"FK"},{name:"CustomerID",key:"FK"}], rows: [["V-07","WXY1234","MD-05","C-12"]] },
          { name: "SERVICE", note: "Workshop job", columns: [{name:"ServiceID",key:"PK"},{name:"VehicleID",key:"FK"},"ServiceDate"], rows: [["SV-88","V-07","18 Aug"]] },
          { name: "SPARE_PART", note: "Catalog", columns: [{name:"PartID",key:"PK"},"PartName","Price"], rows: [["PT-01","Oil","45"]] },
          { name: "SERVICE_ITEM", note: "Invoice lines", columns: [{name:"ServiceID",key:"PK/FK"},{name:"PartID",key:"PK/FK"},"Quantity"], rows: [["SV-88","PT-01","1"]] }
        ]
      }
    ]
  },
  {
    title: "Event Registration",
    category: "Events & attendees",
    icon: "✦",
    headline: "Place attendees, venues, and organizations where they belong.",
    context: "An event has many attendees. Venue and attendee organization details should not be repeated in every ticket record.",
    quiz: {
      question: "Which attribute truly belongs to the EVENT–ATTENDEE relationship?",
      answer: "TicketType, because it describes one attendee's registration for one particular event."
    },
    stages: [
      {
        label: "RAW", name: "Unorganized Table",
        description: "An AttendeeList cell stores several people, organizations, and ticket types inside one event row.",
        ruleCaption: "CURRENT PROBLEM", rule: "Attendees form a repeating group", dependency: "AttendeeList = {Person, Organization, Ticket} × many",
        action: "Identify each registration", before: "VIP and Standard attendees share one field", after: "Every attendee-event pair needs a row",
        tables: [{ name: "EVENT_SHEET", note: "Unorganized source", columns: ["EventID","EventName","VenueID","VenueName","City","AttendeeList"], rows: [["E-24","Data Summit","V-06","Civic Hall","Kuala Lumpur","A-12 Mei | O-03 Nova | VIP; A-18 Dan | O-07 Axis | Standard"]], problemColumns: [5] }]
      },
      {
        label: "1NF", name: "Atomic Values",
        description: "Create one row for each attendee-event pair with a single ticket type per record.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One registration per row", dependency: "(EventID, AttendeeID) → TicketType",
        action: "Attendee list → registration rows", before: "Several attendees share one cell", after: "Each attendee gets one event record",
        tables: [{ name: "REGISTRATION_1NF", note: "Composite primary key", columns: [{name:"EventID",key:"PK"},{name:"AttendeeID",key:"PK"},"EventName","VenueID","VenueName","City","AttendeeName","OrganizationID","OrganizationName","TicketType"], rows: [["E-24","A-12","Data Summit","V-06","Civic Hall","Kuala Lumpur","Mei","O-03","Nova","VIP"],["E-24","A-18","Data Summit","V-06","Civic Hall","Kuala Lumpur","Dan","O-07","Axis","Standard"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency",
        description: "Event details depend only on EventID; attendee and organization details depend only on AttendeeID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Relationship tables store relationship facts", dependency: "AttendeeID → AttendeeName, OrganizationID",
        action: "Separate events and attendees", before: "AttendeeName repeats for every event", after: "ATTENDEE stores the profile once",
        tables: [
          { name: "EVENT", note: "Program", columns: [{name:"EventID",key:"PK"},"EventName","VenueID","VenueName","City"], rows: [["E-24","Data Summit","V-06","Civic Hall","Kuala Lumpur"]] },
          { name: "ATTENDEE", note: "Profile", columns: [{name:"AttendeeID",key:"PK"},"AttendeeName","OrganizationID","OrganizationName"], rows: [["A-12","Mei","O-03","Nova"]] },
          { name: "REGISTRATION", note: "Ticket", columns: [{name:"EventID",key:"PK/FK"},{name:"AttendeeID",key:"PK/FK"},"TicketType"], rows: [["E-24","A-12","VIP"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency",
        description: "Venue facts depend on VenueID and organization facts depend on OrganizationID, so both become independent entities.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Reference entities live separately", dependency: "EventID → VenueID → VenueName, City",
        action: "Extract venue and organization data", before: "Venue and organization names repeat", after: "EVENT and ATTENDEE keep foreign keys",
        tables: [
          { name: "VENUE", note: "Location", columns: [{name:"VenueID",key:"PK"},"VenueName","City"], rows: [["V-06","Civic Hall","Kuala Lumpur"]] },
          { name: "ORGANIZATION", note: "Employer", columns: [{name:"OrganizationID",key:"PK"},"OrganizationName"], rows: [["O-03","Nova"]] },
          { name: "EVENT", note: "Program", columns: [{name:"EventID",key:"PK"},"EventName",{name:"VenueID",key:"FK"}], rows: [["E-24","Data Summit","V-06"]] },
          { name: "ATTENDEE", note: "Profile", columns: [{name:"AttendeeID",key:"PK"},"AttendeeName",{name:"OrganizationID",key:"FK"}], rows: [["A-12","Mei","O-03"]] },
          { name: "REGISTRATION", note: "Ticket", columns: [{name:"EventID",key:"PK/FK"},{name:"AttendeeID",key:"PK/FK"},"TicketType"], rows: [["E-24","A-12","VIP"]] }
        ]
      }
    ]
  }
];

lessons.push(
  {
    title: "Restaurant Orders", category: "Food service", icon: "◉",
    headline: "Separate an order slip into tables that scale.",
    context: "A restaurant order contains several menu items. Menu names, categories, and prices should not be typed repeatedly on every slip.",
    quiz: { question: "Why does CategoryName leave MENU_ITEM in 3NF?", answer: "CategoryName depends on CategoryID, creating the transitive path MenuItemID → CategoryID → CategoryName." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "One Items cell stores multiple dishes, quantities, prices, and categories.",
        ruleCaption: "CURRENT PROBLEM", rule: "Order items form a repeating group", dependency: "Items = {MenuItem, Quantity, Price} × many",
        action: "Identify each ordered item", before: "Pasta and Juice share one Items cell", after: "Each menu item needs an individual row",
        tables: [{ name: "ORDER_SLIP", note: "Unorganized source", columns: ["OrderID","OrderDate","TableNo","Items"], rows: [["O-511","18 Aug","T-07","M-12 Pasta | Main | 28 ×2; M-31 Juice | Drink | 8 ×1"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Split the item list so one row represents one menu item in one order.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One ordered item per row", dependency: "(OrderID, MenuItemID) → Quantity",
        action: "Item list → order-item rows", before: "Several dishes share one field", after: "Each dish, price, and quantity is atomic",
        tables: [{ name: "ORDER_1NF", note: "Composite primary key", columns: [{name:"OrderID",key:"PK"},{name:"MenuItemID",key:"PK"},"OrderDate","TableNo","MenuName","CategoryID","CategoryName","Price","Quantity"], rows: [["O-511","M-12","18 Aug","T-07","Pasta","C-01","Main","28","2"],["O-511","M-31","18 Aug","T-07","Juice","C-03","Drink","8","1"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Order facts depend only on OrderID; menu facts depend only on MenuItemID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove dependencies on part of the key", dependency: "MenuItemID → MenuName, Price, CategoryID",
        action: "Separate orders and menu items", before: "Menu price repeats on every slip", after: "MENU_ITEM stores the price once",
        tables: [
          { name: "ORDER", note: "Order header", columns: [{name:"OrderID",key:"PK"},"OrderDate","TableNo"], rows: [["O-511","18 Aug","T-07"]] },
          { name: "MENU_ITEM", note: "Menu catalog", columns: [{name:"MenuItemID",key:"PK"},"MenuName","Price","CategoryID","CategoryName"], rows: [["M-12","Pasta","28","C-01","Main"]] },
          { name: "ORDER_ITEM", note: "Line items", columns: [{name:"OrderID",key:"PK/FK"},{name:"MenuItemID",key:"PK/FK"},"Quantity"], rows: [["O-511","M-12","2"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Move category labels into their own reference table.",
        ruleCaption: "THIRD NORMAL FORM", rule: "No transitive dependencies", dependency: "MenuItemID → CategoryID → CategoryName",
        action: "Extract menu categories", before: "CategoryName repeats across dishes", after: "MENU_ITEM keeps CategoryID as a foreign key",
        tables: [
          { name: "CATEGORY", note: "Menu reference", columns: [{name:"CategoryID",key:"PK"},"CategoryName"], rows: [["C-01","Main"]] },
          { name: "MENU_ITEM", note: "Menu catalog", columns: [{name:"MenuItemID",key:"PK"},"MenuName","Price",{name:"CategoryID",key:"FK"}], rows: [["M-12","Pasta","28","C-01"]] },
          { name: "ORDER", note: "Order header", columns: [{name:"OrderID",key:"PK"},"OrderDate","TableNo"], rows: [["O-511","18 Aug","T-07"]] },
          { name: "ORDER_ITEM", note: "Line items", columns: [{name:"OrderID",key:"PK/FK"},{name:"MenuItemID",key:"PK/FK"},"Quantity"], rows: [["O-511","M-12","2"]] }
        ]
      }
    ]
  },
  {
    title: "Employee Training", category: "Human resources", icon: "□",
    headline: "Organize employee learning and course completion.",
    context: "Employees complete several courses. Department, provider, course, and result data become inconsistent when stored in one training sheet.",
    quiz: { question: "Which table stores Result after 3NF?", answer: "COMPLETION, because Result describes one employee's outcome for one particular course." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A CoursesCompleted field contains many course-provider-result bundles.",
        ruleCaption: "CURRENT PROBLEM", rule: "Completed courses repeat inside one cell", dependency: "CoursesCompleted = {Course, Provider, Result} × many",
        action: "Find each completion record", before: "Safety:Pass and Excel:Distinction share one cell", after: "Each completed course needs a row",
        tables: [{ name: "TRAINING_SHEET", note: "Unorganized source", columns: ["EmployeeID","EmployeeName","Department","CoursesCompleted"], rows: [["E-77","Nadia","D-04 Operations","C-11 Safety | P-02 SafeCo | Pass; C-20 Excel | P-08 SkillLab | Distinction"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for each employee-course completion.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One course result per row", dependency: "(EmployeeID, CourseID) → Result",
        action: "Course history → completion rows", before: "Multiple outcomes share one field", after: "Every result becomes atomic",
        tables: [{ name: "COMPLETION_1NF", note: "Composite primary key", columns: [{name:"EmployeeID",key:"PK"},{name:"CourseID",key:"PK"},"EmployeeName","DepartmentID","DepartmentName","CourseName","ProviderID","ProviderName","Result"], rows: [["E-77","C-11","Nadia","D-04","Operations","Safety","P-02","SafeCo","Pass"],["E-77","C-20","Nadia","D-04","Operations","Excel","P-08","SkillLab","Distinction"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Employee facts depend only on EmployeeID; course and provider facts depend only on CourseID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Every attribute uses the whole key", dependency: "CourseID → CourseName, ProviderID",
        action: "Separate employees and courses", before: "CourseName repeats for every learner", after: "COURSE stores course facts once",
        tables: [
          { name: "EMPLOYEE", note: "Employee profile", columns: [{name:"EmployeeID",key:"PK"},"EmployeeName","DepartmentID","DepartmentName"], rows: [["E-77","Nadia","D-04","Operations"]] },
          { name: "COURSE", note: "Training catalog", columns: [{name:"CourseID",key:"PK"},"CourseName","ProviderID","ProviderName"], rows: [["C-11","Safety","P-02","SafeCo"]] },
          { name: "COMPLETION", note: "Learning result", columns: [{name:"EmployeeID",key:"PK/FK"},{name:"CourseID",key:"PK/FK"},"Result"], rows: [["E-77","C-11","Pass"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Department and provider names depend on their own identifiers.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Reference entities live independently", dependency: "EmployeeID → DepartmentID → DepartmentName",
        action: "Extract departments and providers", before: "Names repeat across employees and courses", after: "EMPLOYEE and COURSE retain foreign keys",
        tables: [
          { name: "DEPARTMENT", note: "Organization unit", columns: [{name:"DepartmentID",key:"PK"},"DepartmentName"], rows: [["D-04","Operations"]] },
          { name: "PROVIDER", note: "Training partner", columns: [{name:"ProviderID",key:"PK"},"ProviderName"], rows: [["P-02","SafeCo"]] },
          { name: "EMPLOYEE", note: "Employee profile", columns: [{name:"EmployeeID",key:"PK"},"EmployeeName",{name:"DepartmentID",key:"FK"}], rows: [["E-77","Nadia","D-04"]] },
          { name: "COURSE", note: "Training catalog", columns: [{name:"CourseID",key:"PK"},"CourseName",{name:"ProviderID",key:"FK"}], rows: [["C-11","Safety","P-02"]] },
          { name: "COMPLETION", note: "Learning result", columns: [{name:"EmployeeID",key:"PK/FK"},{name:"CourseID",key:"PK/FK"},"Result"], rows: [["E-77","C-11","Pass"]] }
        ]
      }
    ]
  },
  {
    title: "Flight Itineraries", category: "Travel", icon: "✈",
    headline: "Turn a multi-flight itinerary into dependable records.",
    context: "One booking may contain several flights. Passenger and airport details should not be copied into every itinerary segment.",
    quiz: { question: "Why does AirportCity belong in AIRPORT?", answer: "AirportCity depends on AirportID, not on FlightID. Storing it in AIRPORT removes a transitive dependency." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "The FlightSegments field contains several origin-destination-seat bundles.",
        ruleCaption: "CURRENT PROBLEM", rule: "Flight segments repeat in one field", dependency: "FlightSegments = {Flight, Airports, Seat} × many",
        action: "Identify each itinerary segment", before: "AK611 and SQ115 share one cell", after: "Each flight segment needs a record",
        tables: [{ name: "ITINERARY_SHEET", note: "Unorganized source", columns: ["BookingID","Passenger","FlightSegments"], rows: [["B-902","P-17 Elena","AK611 KUL→SIN 14A; SQ115 SIN→NRT 22C"]], problemColumns: [2] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Split the itinerary so each booking-flight pair appears on one row.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One flight segment per row", dependency: "(BookingID, FlightID) → SeatNo",
        action: "Flight list → segment rows", before: "Several flights share one field", after: "Flight, airports, and seat are atomic",
        tables: [{ name: "ITINERARY_1NF", note: "Composite primary key", columns: [{name:"BookingID",key:"PK"},{name:"FlightID",key:"PK"},"PassengerID","PassengerName","OriginID","OriginName","OriginCity","DestinationID","DestinationName","DestinationCity","SeatNo"], rows: [["B-902","AK611","P-17","Elena","KUL","KLIA","Kuala Lumpur","SIN","Changi","Singapore","14A"],["B-902","SQ115","P-17","Elena","SIN","Changi","Singapore","NRT","Narita","Tokyo","22C"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Passenger and booking data depend only on BookingID; route data depends only on FlightID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove partial dependencies", dependency: "FlightID → OriginID, DestinationID",
        action: "Separate bookings and flights", before: "Route data repeats across bookings", after: "FLIGHT stores each route once",
        tables: [
          { name: "BOOKING", note: "Booking header", columns: [{name:"BookingID",key:"PK"},"PassengerID","PassengerName"], rows: [["B-902","P-17","Elena"]] },
          { name: "FLIGHT", note: "Scheduled route", columns: [{name:"FlightID",key:"PK"},"OriginID","OriginName","OriginCity","DestinationID","DestinationName","DestinationCity"], rows: [["AK611","KUL","KLIA","Kuala Lumpur","SIN","Changi","Singapore"]] },
          { name: "BOOKING_FLIGHT", note: "Itinerary segment", columns: [{name:"BookingID",key:"PK/FK"},{name:"FlightID",key:"PK/FK"},"SeatNo"], rows: [["B-902","AK611","14A"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Passenger names and airport labels are determined by their own IDs.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Store descriptive facts with their determinants", dependency: "FlightID → OriginID → OriginName, OriginCity",
        action: "Extract passengers and airports", before: "Airport labels repeat on many flights", after: "FLIGHT references AIRPORT twice",
        tables: [
          { name: "PASSENGER", note: "Traveler profile", columns: [{name:"PassengerID",key:"PK"},"PassengerName"], rows: [["P-17","Elena"]] },
          { name: "AIRPORT", note: "Airport reference", columns: [{name:"AirportID",key:"PK"},"AirportName","AirportCity"], rows: [["KUL","KLIA","Kuala Lumpur"],["SIN","Changi","Singapore"]] },
          { name: "BOOKING", note: "Booking header", columns: [{name:"BookingID",key:"PK"},{name:"PassengerID",key:"FK"}], rows: [["B-902","P-17"]] },
          { name: "FLIGHT", note: "Scheduled route", columns: [{name:"FlightID",key:"PK"},{name:"OriginID",key:"FK"},{name:"DestinationID",key:"FK"}], rows: [["AK611","KUL","SIN"]] },
          { name: "BOOKING_FLIGHT", note: "Itinerary segment", columns: [{name:"BookingID",key:"PK/FK"},{name:"FlightID",key:"PK/FK"},"SeatNo"], rows: [["B-902","AK611","14A"]] }
        ]
      }
    ]
  },
  {
    title: "Insurance Claims", category: "Financial services", icon: "◆",
    headline: "Separate a claim from services, plans, and providers.",
    context: "A claim can include many assessed services. Policyholder, plan, provider, and service details should not be repeated on every claim line.",
    quiz: { question: "Where should ApprovedAmount be stored?", answer: "In CLAIM_SERVICE, because it is specific to one service assessed within one claim." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "An AssessedServices cell contains multiple service-provider-amount groups.",
        ruleCaption: "CURRENT PROBLEM", rule: "Claim services repeat inside one field", dependency: "AssessedServices = {Service, Provider, Amount} × many",
        action: "Identify each assessed service", before: "Consultation and X-ray share one cell", after: "Each assessed service needs a row",
        tables: [{ name: "CLAIM_SHEET", note: "Unorganized source", columns: ["ClaimID","Policy","Policyholder","Plan","AssessedServices"], rows: [["CLM-44","POL-08","H-11 Farah","PL-02 Silver","SV-01 Consultation | PR-05 HealthPoint | 120; SV-09 X-ray | PR-07 ScanLab | 260"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row per claim-service pair with one approved amount per cell.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One assessed service per row", dependency: "(ClaimID, ServiceID) → ApprovedAmount",
        action: "Service list → claim-service rows", before: "Multiple services share one field", after: "Each amount becomes independently addressable",
        tables: [{ name: "CLAIM_1NF", note: "Composite primary key", columns: [{name:"ClaimID",key:"PK"},{name:"ServiceID",key:"PK"},"PolicyID","HolderID","HolderName","PlanID","PlanName","ServiceName","ProviderID","ProviderName","ApprovedAmount"], rows: [["CLM-44","SV-01","POL-08","H-11","Farah","PL-02","Silver","Consultation","PR-05","HealthPoint","120"],["CLM-44","SV-09","POL-08","H-11","Farah","PL-02","Silver","X-ray","PR-07","ScanLab","260"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Claim and policy facts depend only on ClaimID; service and provider facts depend only on ServiceID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove attributes tied to one key part", dependency: "ServiceID → ServiceName, ProviderID",
        action: "Separate claims and services", before: "ServiceName repeats across claims", after: "SERVICE stores service facts once",
        tables: [
          { name: "CLAIM", note: "Claim header", columns: [{name:"ClaimID",key:"PK"},"PolicyID","HolderID","HolderName","PlanID","PlanName"], rows: [["CLM-44","POL-08","H-11","Farah","PL-02","Silver"]] },
          { name: "SERVICE", note: "Covered service", columns: [{name:"ServiceID",key:"PK"},"ServiceName","ProviderID","ProviderName"], rows: [["SV-01","Consultation","PR-05","HealthPoint"]] },
          { name: "CLAIM_SERVICE", note: "Assessment", columns: [{name:"ClaimID",key:"PK/FK"},{name:"ServiceID",key:"PK/FK"},"ApprovedAmount"], rows: [["CLM-44","SV-01","120"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Holder, plan, and provider names are controlled by their own identifiers.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Remove descriptive transit chains", dependency: "ClaimID → PlanID → PlanName",
        action: "Extract holder, plan, and provider entities", before: "Names repeat across claims and services", after: "CLAIM and SERVICE retain foreign keys",
        tables: [
          { name: "POLICYHOLDER", note: "Customer profile", columns: [{name:"HolderID",key:"PK"},"HolderName"], rows: [["H-11","Farah"]] },
          { name: "PLAN", note: "Coverage plan", columns: [{name:"PlanID",key:"PK"},"PlanName"], rows: [["PL-02","Silver"]] },
          { name: "PROVIDER", note: "Service provider", columns: [{name:"ProviderID",key:"PK"},"ProviderName"], rows: [["PR-05","HealthPoint"]] },
          { name: "CLAIM", note: "Claim header", columns: [{name:"ClaimID",key:"PK"},"PolicyID",{name:"HolderID",key:"FK"},{name:"PlanID",key:"FK"}], rows: [["CLM-44","POL-08","H-11","PL-02"]] },
          { name: "SERVICE", note: "Covered service", columns: [{name:"ServiceID",key:"PK"},"ServiceName",{name:"ProviderID",key:"FK"}], rows: [["SV-01","Consultation","PR-05"]] },
          { name: "CLAIM_SERVICE", note: "Assessment", columns: [{name:"ClaimID",key:"PK/FK"},{name:"ServiceID",key:"PK/FK"},"ApprovedAmount"], rows: [["CLM-44","SV-01","120"]] }
        ]
      }
    ]
  },
  {
    title: "Music Playlists", category: "Media", icon: "♫",
    headline: "Arrange playlists, tracks, users, and artists cleanly.",
    context: "A playlist contains many tracks. User and artist details should not be copied into every playlist entry.",
    quiz: { question: "Why does Position stay in PLAYLIST_TRACK?", answer: "Position describes where one track appears in one playlist, so it depends on the full PlaylistID + TrackID key." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A Tracks field stores many track-artist-position bundles.",
        ruleCaption: "CURRENT PROBLEM", rule: "Playlist tracks repeat inside one cell", dependency: "Tracks = {Track, Artist, Position} × many",
        action: "Identify each playlist entry", before: "Two songs share one Tracks field", after: "Each track needs a playlist row",
        tables: [{ name: "PLAYLIST_SHEET", note: "Unorganized source", columns: ["PlaylistID","PlaylistName","User","Tracks"], rows: [["P-81","Morning Focus","U-14 Kai","T-01 Drift | A-04 Luma | #1; T-08 Awake | A-09 Nori | #2"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Split the track list so each playlist-track combination gets one row.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One track placement per row", dependency: "(PlaylistID, TrackID) → Position",
        action: "Track list → playlist rows", before: "Songs and positions share one cell", after: "Each position becomes atomic",
        tables: [{ name: "PLAYLIST_1NF", note: "Composite primary key", columns: [{name:"PlaylistID",key:"PK"},{name:"TrackID",key:"PK"},"PlaylistName","UserID","UserName","TrackName","ArtistID","ArtistName","Position"], rows: [["P-81","T-01","Morning Focus","U-14","Kai","Drift","A-04","Luma","1"],["P-81","T-08","Morning Focus","U-14","Kai","Awake","A-09","Nori","2"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Playlist and user facts depend only on PlaylistID; track and artist facts depend only on TrackID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Use the full relationship key", dependency: "TrackID → TrackName, ArtistID",
        action: "Separate playlists and tracks", before: "TrackName repeats across playlists", after: "TRACK stores each song once",
        tables: [
          { name: "PLAYLIST", note: "Playlist header", columns: [{name:"PlaylistID",key:"PK"},"PlaylistName","UserID","UserName"], rows: [["P-81","Morning Focus","U-14","Kai"]] },
          { name: "TRACK", note: "Music catalog", columns: [{name:"TrackID",key:"PK"},"TrackName","ArtistID","ArtistName"], rows: [["T-01","Drift","A-04","Luma"]] },
          { name: "PLAYLIST_TRACK", note: "Track order", columns: [{name:"PlaylistID",key:"PK/FK"},{name:"TrackID",key:"PK/FK"},"Position"], rows: [["P-81","T-01","1"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "UserName and ArtistName depend on their own identifiers.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Creators and owners become entities", dependency: "TrackID → ArtistID → ArtistName",
        action: "Extract users and artists", before: "Artist and user names repeat", after: "PLAYLIST and TRACK keep foreign keys",
        tables: [
          { name: "USER", note: "Playlist owner", columns: [{name:"UserID",key:"PK"},"UserName"], rows: [["U-14","Kai"]] },
          { name: "ARTIST", note: "Music creator", columns: [{name:"ArtistID",key:"PK"},"ArtistName"], rows: [["A-04","Luma"]] },
          { name: "PLAYLIST", note: "Playlist header", columns: [{name:"PlaylistID",key:"PK"},"PlaylistName",{name:"UserID",key:"FK"}], rows: [["P-81","Morning Focus","U-14"]] },
          { name: "TRACK", note: "Music catalog", columns: [{name:"TrackID",key:"PK"},"TrackName",{name:"ArtistID",key:"FK"}], rows: [["T-01","Drift","A-04"]] },
          { name: "PLAYLIST_TRACK", note: "Track order", columns: [{name:"PlaylistID",key:"PK/FK"},{name:"TrackID",key:"PK/FK"},"Position"], rows: [["P-81","T-01","1"]] }
        ]
      }
    ]
  },
  {
    title: "Manufacturing Orders", category: "Production", icon: "⚙",
    headline: "Break a work order into products, components, and suppliers.",
    context: "A work order consumes several components. Product, factory, supplier, and component facts should not repeat on every material line.",
    quiz: { question: "What determines RequiredQty?", answer: "WorkOrderID + ComponentID, because the required quantity is specific to one component in one work order." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A Components field combines several materials, suppliers, and required quantities.",
        ruleCaption: "CURRENT PROBLEM", rule: "Material lines repeat inside one field", dependency: "Components = {Component, Supplier, Quantity} × many",
        action: "Identify every required component", before: "Frame and Motor share one cell", after: "Each component needs a work-order row",
        tables: [{ name: "WORK_ORDER_SHEET", note: "Unorganized source", columns: ["WorkOrderID","Product","Factory","Components"], rows: [["WO-63","PD-09 Desk Fan","F-02 North Plant","CP-01 Frame | S-08 MetalPro | 1; CP-07 Motor | S-11 SpinWorks | 1"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for every work-order-component pair.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One component requirement per row", dependency: "(WorkOrderID, ComponentID) → RequiredQty",
        action: "Component list → material rows", before: "Several components share one field", after: "Every quantity becomes atomic",
        tables: [{ name: "WORK_ORDER_1NF", note: "Composite primary key", columns: [{name:"WorkOrderID",key:"PK"},{name:"ComponentID",key:"PK"},"ProductID","ProductName","FactoryID","FactoryName","ComponentName","SupplierID","SupplierName","RequiredQty"], rows: [["WO-63","CP-01","PD-09","Desk Fan","F-02","North Plant","Frame","S-08","MetalPro","1"],["WO-63","CP-07","PD-09","Desk Fan","F-02","North Plant","Motor","S-11","SpinWorks","1"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Work-order facts depend only on WorkOrderID; component and supplier facts depend only on ComponentID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove key-part dependencies", dependency: "ComponentID → ComponentName, SupplierID",
        action: "Separate work orders and components", before: "Component facts repeat in many orders", after: "COMPONENT stores material facts once",
        tables: [
          { name: "WORK_ORDER", note: "Production order", columns: [{name:"WorkOrderID",key:"PK"},"ProductID","ProductName","FactoryID","FactoryName"], rows: [["WO-63","PD-09","Desk Fan","F-02","North Plant"]] },
          { name: "COMPONENT", note: "Material catalog", columns: [{name:"ComponentID",key:"PK"},"ComponentName","SupplierID","SupplierName"], rows: [["CP-01","Frame","S-08","MetalPro"]] },
          { name: "WORK_ORDER_COMPONENT", note: "Material need", columns: [{name:"WorkOrderID",key:"PK/FK"},{name:"ComponentID",key:"PK/FK"},"RequiredQty"], rows: [["WO-63","CP-01","1"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Product, factory, and supplier names are determined by their own IDs.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Remove all descriptive transit chains", dependency: "ComponentID → SupplierID → SupplierName",
        action: "Extract product, factory, and supplier", before: "Names repeat across production records", after: "Core tables retain foreign keys",
        tables: [
          { name: "PRODUCT", note: "Finished good", columns: [{name:"ProductID",key:"PK"},"ProductName"], rows: [["PD-09","Desk Fan"]] },
          { name: "FACTORY", note: "Production site", columns: [{name:"FactoryID",key:"PK"},"FactoryName"], rows: [["F-02","North Plant"]] },
          { name: "SUPPLIER", note: "Material source", columns: [{name:"SupplierID",key:"PK"},"SupplierName"], rows: [["S-08","MetalPro"]] },
          { name: "WORK_ORDER", note: "Production order", columns: [{name:"WorkOrderID",key:"PK"},{name:"ProductID",key:"FK"},{name:"FactoryID",key:"FK"}], rows: [["WO-63","PD-09","F-02"]] },
          { name: "COMPONENT", note: "Material catalog", columns: [{name:"ComponentID",key:"PK"},"ComponentName",{name:"SupplierID",key:"FK"}], rows: [["CP-01","Frame","S-08"]] },
          { name: "WORK_ORDER_COMPONENT", note: "Material need", columns: [{name:"WorkOrderID",key:"PK/FK"},{name:"ComponentID",key:"PK/FK"},"RequiredQty"], rows: [["WO-63","CP-01","1"]] }
        ]
      }
    ]
  },
  {
    title: "School Attendance", category: "Education operations", icon: "✓",
    headline: "Normalize class attendance without repeated profiles.",
    context: "A student has many attendance dates. Student, class, and teacher details should not be copied into every daily record.",
    quiz: { question: "Why does AttendanceStatus remain in ATTENDANCE?", answer: "It describes one student's attendance in one class on one date, so it depends on the complete composite key." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "An AttendanceHistory cell stores many date-status pairs for one student and class.",
        ruleCaption: "CURRENT PROBLEM", rule: "Daily statuses repeat inside one field", dependency: "AttendanceHistory = {Date, Status} × many",
        action: "Identify each attendance event", before: "Present and Absent dates share one cell", after: "Each date needs an attendance row",
        tables: [{ name: "ATTENDANCE_SHEET", note: "Unorganized source", columns: ["Student","Class","Teacher","AttendanceHistory"], rows: [["S-31 Hana","C-08 Mathematics","T-04 Mr. Lee","18 Aug Present; 19 Aug Absent; 20 Aug Present"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for each student-class-date attendance event.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One date and status per row", dependency: "(StudentID, ClassID, AttendanceDate) → Status",
        action: "History list → daily rows", before: "Multiple dates share one cell", after: "Each date and status is atomic",
        tables: [{ name: "ATTENDANCE_1NF", note: "Composite primary key", columns: [{name:"StudentID",key:"PK"},{name:"ClassID",key:"PK"},{name:"AttendanceDate",key:"PK"},"StudentName","ClassName","TeacherID","TeacherName","Status"], rows: [["S-31","C-08","18 Aug","Hana","Mathematics","T-04","Mr. Lee","Present"],["S-31","C-08","19 Aug","Hana","Mathematics","T-04","Mr. Lee","Absent"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "StudentName depends only on StudentID; class and teacher facts depend only on ClassID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Profiles do not depend on the full event key", dependency: "ClassID → ClassName, TeacherID",
        action: "Separate students and classes", before: "Names repeat every school day", after: "ATTENDANCE stores only event facts",
        tables: [
          { name: "STUDENT", note: "Student profile", columns: [{name:"StudentID",key:"PK"},"StudentName"], rows: [["S-31","Hana"]] },
          { name: "CLASS", note: "Class profile", columns: [{name:"ClassID",key:"PK"},"ClassName","TeacherID","TeacherName"], rows: [["C-08","Mathematics","T-04","Mr. Lee"]] },
          { name: "ATTENDANCE", note: "Daily event", columns: [{name:"StudentID",key:"PK/FK"},{name:"ClassID",key:"PK/FK"},{name:"AttendanceDate",key:"PK"},"Status"], rows: [["S-31","C-08","18 Aug","Present"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "TeacherName depends on TeacherID and moves out of CLASS.",
        ruleCaption: "THIRD NORMAL FORM", rule: "No descriptive attribute determines another", dependency: "ClassID → TeacherID → TeacherName",
        action: "Extract the teacher entity", before: "TeacherName repeats across classes", after: "CLASS references TEACHER",
        tables: [
          { name: "STUDENT", note: "Student profile", columns: [{name:"StudentID",key:"PK"},"StudentName"], rows: [["S-31","Hana"]] },
          { name: "TEACHER", note: "Teaching staff", columns: [{name:"TeacherID",key:"PK"},"TeacherName"], rows: [["T-04","Mr. Lee"]] },
          { name: "CLASS", note: "Class profile", columns: [{name:"ClassID",key:"PK"},"ClassName",{name:"TeacherID",key:"FK"}], rows: [["C-08","Mathematics","T-04"]] },
          { name: "ATTENDANCE", note: "Daily event", columns: [{name:"StudentID",key:"PK/FK"},{name:"ClassID",key:"PK/FK"},{name:"AttendanceDate",key:"PK"},"Status"], rows: [["S-31","C-08","18 Aug","Present"]] }
        ]
      }
    ]
  },
  {
    title: "Product Reviews", category: "E-commerce", icon: "★",
    headline: "Keep products, reviewers, categories, and ratings consistent.",
    context: "A product receives reviews from many users. Reviewer and category details should not be embedded in a product review list.",
    quiz: { question: "What does the REVIEW table represent?", answer: "It represents the relationship between one product and one user, with Rating and Comment as relationship facts." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A Reviews cell contains several user-rating-comment bundles.",
        ruleCaption: "CURRENT PROBLEM", rule: "Reviews repeat inside one field", dependency: "Reviews = {User, Rating, Comment} × many",
        action: "Identify each user review", before: "Two reviewers share one Reviews cell", after: "Each product-user review needs a row",
        tables: [{ name: "PRODUCT_SHEET", note: "Unorganized source", columns: ["ProductID","ProductName","Category","Reviews"], rows: [["P-61","Travel Mug","C-06 Kitchen","U-02 Ava | 5 | Keeps heat; U-19 Ben | 4 | Solid lid"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for each product-user review with atomic rating and comment values.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One review per product-user pair", dependency: "(ProductID, UserID) → Rating, Comment",
        action: "Review list → review rows", before: "Several ratings share one field", after: "Every rating becomes independently searchable",
        tables: [{ name: "REVIEW_1NF", note: "Composite primary key", columns: [{name:"ProductID",key:"PK"},{name:"UserID",key:"PK"},"ProductName","CategoryID","CategoryName","UserName","Rating","Comment"], rows: [["P-61","U-02","Travel Mug","C-06","Kitchen","Ava","5","Keeps heat"],["P-61","U-19","Travel Mug","C-06","Kitchen","Ben","4","Solid lid"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Product facts depend only on ProductID; user facts depend only on UserID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Keep profiles outside the relationship", dependency: "ProductID → ProductName, CategoryID",
        action: "Separate products and users", before: "Names repeat across review rows", after: "REVIEW keeps rating and comment",
        tables: [
          { name: "PRODUCT", note: "Catalog item", columns: [{name:"ProductID",key:"PK"},"ProductName","CategoryID","CategoryName"], rows: [["P-61","Travel Mug","C-06","Kitchen"]] },
          { name: "USER", note: "Reviewer profile", columns: [{name:"UserID",key:"PK"},"UserName"], rows: [["U-02","Ava"]] },
          { name: "REVIEW", note: "Product feedback", columns: [{name:"ProductID",key:"PK/FK"},{name:"UserID",key:"PK/FK"},"Rating","Comment"], rows: [["P-61","U-02","5","Keeps heat"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "CategoryName depends on CategoryID and belongs in a category reference.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Reference labels have one source", dependency: "ProductID → CategoryID → CategoryName",
        action: "Extract the category entity", before: "Kitchen repeats across products", after: "PRODUCT keeps CategoryID",
        tables: [
          { name: "CATEGORY", note: "Catalog reference", columns: [{name:"CategoryID",key:"PK"},"CategoryName"], rows: [["C-06","Kitchen"]] },
          { name: "PRODUCT", note: "Catalog item", columns: [{name:"ProductID",key:"PK"},"ProductName",{name:"CategoryID",key:"FK"}], rows: [["P-61","Travel Mug","C-06"]] },
          { name: "USER", note: "Reviewer profile", columns: [{name:"UserID",key:"PK"},"UserName"], rows: [["U-02","Ava"]] },
          { name: "REVIEW", note: "Product feedback", columns: [{name:"ProductID",key:"PK/FK"},{name:"UserID",key:"PK/FK"},"Rating","Comment"], rows: [["P-61","U-02","5","Keeps heat"]] }
        ]
      }
    ]
  },
  {
    title: "Property Rentals", category: "Real estate", icon: "⌑",
    headline: "Structure properties, landlords, cities, and tenancies.",
    context: "A property may have many tenants over time. Landlord, city, and tenant data should not repeat in every tenancy record.",
    quiz: { question: "Why is StartDate part of the tenancy key?", answer: "The same tenant may rent the same property in different periods, so StartDate distinguishes each tenancy." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A TenancyHistory field stores several tenant-period-rent bundles.",
        ruleCaption: "CURRENT PROBLEM", rule: "Tenancies repeat inside one field", dependency: "TenancyHistory = {Tenant, StartDate, Rent} × many",
        action: "Identify every tenancy period", before: "Two tenant periods share one field", after: "Each period needs its own record",
        tables: [{ name: "PROPERTY_SHEET", note: "Unorganized source", columns: ["PropertyID","Address","City","Landlord","TenancyHistory"], rows: [["P-18","22 Palm Road","CT-03 Ipoh","L-07 Mira","T-11 Joel | Jan 2025 | 1200; T-24 Sara | Jan 2026 | 1350"]], problemColumns: [4] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for each property-tenant-start-date combination.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One tenancy period per row", dependency: "(PropertyID, TenantID, StartDate) → MonthlyRent",
        action: "History list → tenancy rows", before: "Several periods share one field", after: "Each tenant, date, and rent is atomic",
        tables: [{ name: "TENANCY_1NF", note: "Composite primary key", columns: [{name:"PropertyID",key:"PK"},{name:"TenantID",key:"PK"},{name:"StartDate",key:"PK"},"Address","CityID","CityName","LandlordID","LandlordName","TenantName","MonthlyRent"], rows: [["P-18","T-11","Jan 2025","22 Palm Road","CT-03","Ipoh","L-07","Mira","Joel","1200"],["P-18","T-24","Jan 2026","22 Palm Road","CT-03","Ipoh","L-07","Mira","Sara","1350"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Property facts depend only on PropertyID; tenant name depends only on TenantID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Separate profiles from tenancy events", dependency: "TenantID → TenantName",
        action: "Separate properties and tenants", before: "Address and tenant names repeat", after: "TENANCY retains relationship facts",
        tables: [
          { name: "PROPERTY", note: "Rental asset", columns: [{name:"PropertyID",key:"PK"},"Address","CityID","CityName","LandlordID","LandlordName"], rows: [["P-18","22 Palm Road","CT-03","Ipoh","L-07","Mira"]] },
          { name: "TENANT", note: "Tenant profile", columns: [{name:"TenantID",key:"PK"},"TenantName"], rows: [["T-11","Joel"]] },
          { name: "TENANCY", note: "Rental period", columns: [{name:"PropertyID",key:"PK/FK"},{name:"TenantID",key:"PK/FK"},{name:"StartDate",key:"PK"},"MonthlyRent"], rows: [["P-18","T-11","Jan 2025","1200"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "CityName and LandlordName depend on their own identifiers.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Independent parties and locations get tables", dependency: "PropertyID → CityID → CityName",
        action: "Extract city and landlord entities", before: "Location and owner names repeat", after: "PROPERTY retains foreign keys",
        tables: [
          { name: "CITY", note: "Location reference", columns: [{name:"CityID",key:"PK"},"CityName"], rows: [["CT-03","Ipoh"]] },
          { name: "LANDLORD", note: "Property owner", columns: [{name:"LandlordID",key:"PK"},"LandlordName"], rows: [["L-07","Mira"]] },
          { name: "PROPERTY", note: "Rental asset", columns: [{name:"PropertyID",key:"PK"},"Address",{name:"CityID",key:"FK"},{name:"LandlordID",key:"FK"}], rows: [["P-18","22 Palm Road","CT-03","L-07"]] },
          { name: "TENANT", note: "Tenant profile", columns: [{name:"TenantID",key:"PK"},"TenantName"], rows: [["T-11","Joel"]] },
          { name: "TENANCY", note: "Rental period", columns: [{name:"PropertyID",key:"PK/FK"},{name:"TenantID",key:"PK/FK"},{name:"StartDate",key:"PK"},"MonthlyRent"], rows: [["P-18","T-11","Jan 2025","1200"]] }
        ]
      }
    ]
  },
  {
    title: "Sports Tournament", category: "Sports", icon: "◍",
    headline: "Organize tournaments, teams, coaches, and venues.",
    context: "A tournament includes many teams. Venue and coach details should not be copied into every tournament entry.",
    quiz: { question: "Why does Seed belong in TOURNAMENT_ENTRY?", answer: "Seed describes one team's position in one tournament, so it depends on TournamentID + TeamID." },
    stages: [
      {
        label: "RAW", name: "Unorganized Table", description: "A Teams field stores several team-coach-seed bundles in one tournament row.",
        ruleCaption: "CURRENT PROBLEM", rule: "Team entries repeat inside one field", dependency: "Teams = {Team, Coach, Seed} × many",
        action: "Identify each tournament entry", before: "Falcons and Tigers share one field", after: "Each team entry needs a row",
        tables: [{ name: "TOURNAMENT_SHEET", note: "Unorganized source", columns: ["TournamentID","TournamentName","Venue","Teams"], rows: [["TR-07","City Cup","V-12 Arena One, Shah Alam","TM-03 Falcons | C-08 Riley | Seed 1; TM-09 Tigers | C-14 Sam | Seed 2"]], problemColumns: [3] }]
      },
      {
        label: "1NF", name: "Atomic Values", description: "Create one row for each tournament-team pair with one seed value.",
        ruleCaption: "FIRST NORMAL FORM", rule: "One team entry per row", dependency: "(TournamentID, TeamID) → Seed",
        action: "Team list → entry rows", before: "Several teams share one field", after: "Every team, coach, and seed is atomic",
        tables: [{ name: "TOURNAMENT_1NF", note: "Composite primary key", columns: [{name:"TournamentID",key:"PK"},{name:"TeamID",key:"PK"},"TournamentName","VenueID","VenueName","VenueCity","TeamName","CoachID","CoachName","Seed"], rows: [["TR-07","TM-03","City Cup","V-12","Arena One","Shah Alam","Falcons","C-08","Riley","1"],["TR-07","TM-09","City Cup","V-12","Arena One","Shah Alam","Tigers","C-14","Sam","2"]] }]
      },
      {
        label: "2NF", name: "Full-Key Dependency", description: "Tournament and venue facts depend only on TournamentID; team and coach facts depend only on TeamID.",
        ruleCaption: "SECOND NORMAL FORM", rule: "Remove key-part dependencies", dependency: "TeamID → TeamName, CoachID",
        action: "Separate tournaments and teams", before: "TeamName repeats across tournaments", after: "TEAM stores team facts once",
        tables: [
          { name: "TOURNAMENT", note: "Competition", columns: [{name:"TournamentID",key:"PK"},"TournamentName","VenueID","VenueName","VenueCity"], rows: [["TR-07","City Cup","V-12","Arena One","Shah Alam"]] },
          { name: "TEAM", note: "Team profile", columns: [{name:"TeamID",key:"PK"},"TeamName","CoachID","CoachName"], rows: [["TM-03","Falcons","C-08","Riley"]] },
          { name: "TOURNAMENT_ENTRY", note: "Competition entry", columns: [{name:"TournamentID",key:"PK/FK"},{name:"TeamID",key:"PK/FK"},"Seed"], rows: [["TR-07","TM-03","1"]] }
        ]
      },
      {
        label: "3NF", name: "Direct Dependency", description: "Venue and coach names depend on VenueID and CoachID.",
        ruleCaption: "THIRD NORMAL FORM", rule: "Reference entities have one source", dependency: "TournamentID → VenueID → VenueName, VenueCity",
        action: "Extract venues and coaches", before: "Venue and coach facts repeat", after: "TOURNAMENT and TEAM keep foreign keys",
        tables: [
          { name: "VENUE", note: "Sports venue", columns: [{name:"VenueID",key:"PK"},"VenueName","VenueCity"], rows: [["V-12","Arena One","Shah Alam"]] },
          { name: "COACH", note: "Coach profile", columns: [{name:"CoachID",key:"PK"},"CoachName"], rows: [["C-08","Riley"]] },
          { name: "TOURNAMENT", note: "Competition", columns: [{name:"TournamentID",key:"PK"},"TournamentName",{name:"VenueID",key:"FK"}], rows: [["TR-07","City Cup","V-12"]] },
          { name: "TEAM", note: "Team profile", columns: [{name:"TeamID",key:"PK"},"TeamName",{name:"CoachID",key:"FK"}], rows: [["TM-03","Falcons","C-08"]] },
          { name: "TOURNAMENT_ENTRY", note: "Competition entry", columns: [{name:"TournamentID",key:"PK/FK"},{name:"TeamID",key:"PK/FK"},"Seed"], rows: [["TR-07","TM-03","1"]] }
        ]
      }
    ]
  }
);

const totalStages = lessons.reduce((total, lesson) => total + lesson.stages.length, 0);
let lessonIndex = 0;
let stageIndex = 0;
let answerVisible = false;
const visited = new Set(["0-0"]);
const stageNames = ["RAW", "1NF", "2NF", "3NF"];

const $ = (selector) => document.querySelector(selector);

function columnData(column) {
  return typeof column === "string" ? { name: column } : column;
}

function renderExamples() {
  const list = $("#example-list");
  const select = $("#example-select");
  list.innerHTML = lessons.map((lesson, index) => `
    <button class="example-button ${index === lessonIndex ? "active" : ""}" type="button" data-example="${index}">
      <span class="example-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="example-icon" aria-hidden="true">${lesson.icon}</span>
      <span class="example-name"><strong>${lesson.title}</strong><small>${lesson.category}</small></span>
      <span class="example-arrow">→</span>
    </button>`).join("");
  select.innerHTML = lessons.map((lesson, index) => `<option value="${index}">${index + 1}. ${lesson.title}</option>`).join("");
  select.value = String(lessonIndex);
  list.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => goTo(Number(button.dataset.example), 0)));
}

function renderStages() {
  const tabs = $("#stage-tabs");
  tabs.innerHTML = lessons[lessonIndex].stages.map((stage, index) => `
    <button class="stage-button ${index === stageIndex ? "active" : ""}" type="button" role="tab" aria-selected="${index === stageIndex}" data-stage="${index}">
      <span>0${index}</span><strong>${stage.label}</strong><small>${stage.name}</small><i>${visited.has(`${lessonIndex}-${index}`) ? "✓" : ""}</i>
    </button>`).join("");
  tabs.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => goTo(lessonIndex, Number(button.dataset.stage))));
}

function renderTables(tables) {
  const grid = $("#table-grid");
  grid.className = `table-grid ${tables.length === 1 ? "one" : tables.length >= 4 ? "four" : ""}`;
  grid.innerHTML = tables.map((table, tableIndex) => `
    <section class="db-table" style="--delay:${tableIndex * 45}ms">
      <div class="db-table-header"><strong>${table.name}</strong><span>${table.note}</span></div>
      <div class="data-scroll">
        <table class="data-table">
          <thead><tr>${table.columns.map((column) => {
            const item = columnData(column);
            return `<th><span class="column-title">${item.name}${item.key ? `<b class="key-tag ${item.key.includes("PK") ? "pk" : "fk"}">${item.key}</b>` : ""}</span></th>`;
          }).join("")}</tr></thead>
          <tbody>${table.rows.map((row) => `<tr>${row.map((cell, index) => `<td class="${table.problemColumns?.includes(index) ? "problem-cell" : ""}">${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </section>`).join("");
}

function render() {
  const lesson = lessons[lessonIndex];
  const stage = lesson.stages[stageIndex];
  const progress = Math.round((visited.size / totalStages) * 100);
  renderExamples();
  renderStages();
  $("#example-count").textContent = `${String(lessonIndex + 1).padStart(2, "0")} / ${lessons.length}`;
  $("#lesson-kicker").textContent = `EXAMPLE ${String(lessonIndex + 1).padStart(2, "0")} · ${lesson.category.toUpperCase()}`;
  $("#lesson-title").textContent = lesson.headline;
  $("#lesson-context").textContent = lesson.context;
  $("#progress-value").textContent = `${progress}%`;
  $("#progress-ring").style.setProperty("--progress", `${progress * 3.6}deg`);
  $("#stage-label").textContent = `STAGE ${stageIndex} / 3`;
  $("#stage-title").textContent = `${stage.label} — ${stage.name}`;
  $("#stage-description").textContent = stage.description;
  $("#rule-caption").textContent = stage.ruleCaption;
  $("#stage-rule").textContent = stage.rule;
  $("#stage-dependency").textContent = stage.dependency;
  $("#stage-action").textContent = stage.action;
  $("#stage-before").textContent = stage.before;
  $("#stage-after").textContent = stage.after;
  $("#table-count").textContent = `${stage.tables.length} ${stage.tables.length === 1 ? "table" : "tables"} at this stage`;
  $("#quiz-question").textContent = lesson.quiz.question;
  $("#quiz-answer").textContent = lesson.quiz.answer;
  $("#quiz-answer").hidden = !answerVisible;
  $("#answer-button").innerHTML = `${answerVisible ? "Hide answer" : "Show answer"} <span>${answerVisible ? "↑" : "↓"}</span>`;
  $("#answer-button").setAttribute("aria-expanded", String(answerVisible));
  $("#visited-count").textContent = String(visited.size);
  $("#previous-button").disabled = lessonIndex === 0 && stageIndex === 0;
  $("#next-button").innerHTML = `${stageIndex < 3 ? `Continue to ${stageNames[stageIndex + 1]}` : lessonIndex < lessons.length - 1 ? "Next example" : "Start again"} <span>→</span>`;
  renderTables(stage.tables);
}

function goTo(nextLesson, nextStage) {
  lessonIndex = nextLesson;
  stageIndex = nextStage;
  answerVisible = false;
  visited.add(`${lessonIndex}-${stageIndex}`);
  render();
}

$("#example-select").addEventListener("change", (event) => goTo(Number(event.target.value), 0));
$("#answer-button").addEventListener("click", () => { answerVisible = !answerVisible; render(); });
$("#next-button").addEventListener("click", () => {
  if (stageIndex < 3) goTo(lessonIndex, stageIndex + 1);
  else if (lessonIndex < lessons.length - 1) goTo(lessonIndex + 1, 0);
  else goTo(0, 0);
});
$("#previous-button").addEventListener("click", () => {
  if (stageIndex > 0) goTo(lessonIndex, stageIndex - 1);
  else if (lessonIndex > 0) goTo(lessonIndex - 1, 3);
});
document.addEventListener("keydown", (event) => {
  if (event.target.matches("select, button, a")) return;
  if (event.key === "ArrowRight") $("#next-button").click();
  if (event.key === "ArrowLeft") $("#previous-button").click();
});

render();
