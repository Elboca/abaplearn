import {
    checkAuthState,
    checkSaldoMensagens,
} from './authValidation_simp.js';
const apikey =
    'sk-svcacct-rCZJ4KlGZ1OVeWDVXCjKcX8zkZ7FcYwGd4ooDZ6m1WIrc2M3IgGJj6urQEQhMJT3BlbkFJeP4BeVA70sjes2-6AlD3qthVL69vdrjSSQ-oexFAy0sfebFHexHQ59hMSgxJQA';
const subjects = {
    'ABAP RICEFW': {
        id: 'ricefw',
        title: 'ABAP RICEFW Development',
        details: 'Select a lesson to learn more:\n1. Introduction to ABAP RICEFW\n2. Data Dictionary\n3. ABAP Programming Basics\n4. ABAP Reports\n5. Internal Tables\n6. Modularization Techniques\n7. ABAP Data Types\n8. ABAP Debugging\n9. ABAP Object-Oriented Programming\n10. ALV Reports\n11. Enhancements and Modifications\n12. Batch Data Communication (BDC)\n13. SmartForms and SAPScripts\n14. User Exits and BAdIs\n15. Performance Optimization',
        subtopics: {
            1: 'Introduction to ABAP RICEFW: Overview of Reports, Interfaces, Conversions, Enhancements, Forms, and Workflows in SAP ABAP.',
            2: 'Data Dictionary: Understanding tables, data elements, domains, views, search helps, lock objects, and their significance in SAP.',
            3: 'ABAP Programming Basics: Syntax, data types, operators, control structures, and basic programming constructs.',
            4: 'ABAP Reports: Creating classical, interactive, and ALV reports with practical examples.',
            5: 'Internal Tables: Types, operations, sorting, searching, and looping through internal tables.',
            6: 'Modularization Techniques: Includes, subroutines, function modules, and methods for code reuse and organization.',
            7: 'ABAP Data Types: Elementary, reference, complex data types, and their usage in ABAP programming.',
            8: 'ABAP Debugging: Tools and techniques for debugging ABAP programs, breakpoints, watchpoints, and system debugging.',
            9: 'ABAP Object-Oriented Programming: Classes, objects, inheritance, polymorphism, interfaces, and practical implementation.',
            10: 'ALV Reports: Creating ALV (ABAP List Viewer) reports using function modules and OO methods for advanced reporting.',
            11: 'Enhancements and Modifications: User exits, customer exits, BAdIs, enhancement spots, and the enhancement framework.',
            12: 'Batch Data Communication (BDC): Techniques for data migration and automation using BDC sessions and call transactions.',
            13: 'SmartForms and SAPScripts: Designing and implementing forms for printing documents in SAP.',
            14: 'User Exits and BAdIs: Implementing custom enhancements using user exits and Business Add-Ins (BAdIs).',
            15: 'Performance Optimization: Techniques to improve the performance of ABAP programs, SQL trace, runtime analysis.'
        }
    },
    'ABAP OO': {
        id: 'oo',
        title: 'ABAP Object-Oriented Development',
        details: 'Select a lesson to learn more:\n1. Introduction to ABAP OO\n2. Classes and Objects\n3. Inheritance\n4. Polymorphism\n5. Interfaces\n6. Events\n7. Exception Handling\n8. Singleton Pattern\n9. Factory Pattern\n10. Advanced OO Concepts\n11. Design Patterns\n12. ABAP Units\n13. Persistent Objects\n14. Reflection in ABAP\n15. ABAP and SAP HANA',
        subtopics: {
            1: 'Introduction to ABAP OO: Principles of object-oriented programming in ABAP and benefits over procedural programming.',
            2: 'Classes and Objects: Defining classes, creating objects, visibility sections, and encapsulation.',
            3: 'Inheritance: Creating subclass and superclass relationships, method overriding, and code reuse.',
            4: 'Polymorphism: Implementing dynamic method dispatch and using polymorphic behaviors in ABAP OO.',
            5: 'Interfaces: Defining and implementing interfaces, multiple interface implementations.',
            6: 'Events: Creating and handling events, observer pattern implementation in ABAP OO.',
            7: 'Exception Handling: Creating and raising exceptions, handling exceptions using TRY...CATCH blocks.',
            8: 'Singleton Pattern: Implementing the Singleton design pattern in ABAP for global access to a class instance.',
            9: 'Factory Pattern: Using factory classes to create objects, abstract factory pattern in ABAP OO.',
            10: 'Advanced OO Concepts: Friends, aliases, abstract classes, and final classes in ABAP OO.',
            11: 'Design Patterns: Common design patterns and their implementation in ABAP OO.',
            12: 'ABAP Units: Writing unit tests in ABAP OO to ensure code correctness and reliability.',
            13: 'Persistent Objects: Using Object Services for persistence, managing database transactions with objects.',
            14: 'Reflection in ABAP: Runtime Type Identification (RTTI) and dynamic programming techniques.',
            15: 'ABAP and SAP HANA: Optimizing ABAP code for SAP HANA, using new features and best practices.'
        }
    },
    'ABAP BOPF': {
        id: 'bopf',
        title: 'ABAP BOPF Development',
        details: 'Select a lesson to learn more:\n1. Introduction to BOPF\n2. BOPF Architecture\n3. BOPF Meta Model\n4. Development Tools\n5. BOPF Queries\n6. Business Configuration Objects\n7. Testing and Support in BOPF\n8. Transaction and Log Management\n9. Enhancements in BOPF\n10. Error Handling\n11. Integration with SAP UI5\n12. Node.js and BOPF\n13. Security in BOPF\n14. Performance Tuning\n15. Advanced BOPF Concepts',
        subtopics: {
            1: 'Introduction to BOPF: Understanding the Business Object Processing Framework and its role in SAP’s architecture.',
            2: 'BOPF Architecture: Layers of BOPF architecture, including UI, Business Object Layer, Transaction Layer, and Database.',
            3: 'BOPF Meta Model: Structure of the business object model—nodes, actions, determinations, validations, associations.',
            4: 'Development Tools: Using SAP Internal Design Time to create, update, test, and document business objects.',
            5: 'BOPF Queries: Types of queries—node attribute query, custom query, generic result query.',
            6: 'Business Configuration Objects: Creating and managing BCOs for customizable applications.',
            7: 'Testing and Support in BOPF: Debugging tools and techniques, including core service debugging and message analysis.',
            8: 'Transaction and Log Management: Managing transactions, actions, determinations, and validations.',
            9: 'Enhancements in BOPF: Enhancing standard business objects using extensions and modifications.',
            10: 'Error Handling: Implementing error handling mechanisms in BOPF applications.',
            11: 'Integration with SAP UI5: Connecting BOPF with SAP UI5 applications for front-end development.',
            12: 'Node.js and BOPF: Integrating BOPF services with Node.js applications.',
            13: 'Security in BOPF: Implementing authorization checks and secure access to business objects.',
            14: 'Performance Tuning: Techniques to optimize BOPF applications for better performance.',
            15: 'Advanced BOPF Concepts: Deep dive into complex BOPF scenarios and best practices.'
        }
    },
    'ABAP CRM': {
        id: 'crm',
        title: 'ABAP CRM Development',
        details: 'Select a lesson to learn more:\n1. Introduction to CRM\n2. CRM Architecture\n3. CRM Modules\n4. CRM Development Tools\n5. CRM Configuration\n6. CRM Testing\n7. CRM User Interface\n8. Advanced CRM Concepts\n9. Middleware Integration\n10. WebClient UI Framework\n11. BOL and GENIL Programming\n12. One Order Framework\n13. CRM Workflow\n14. CRM Web Services\n15. CRM Mobile Applications',
        subtopics: {
            1: 'Introduction to CRM: Basics of Customer Relationship Management and its importance in businesses.',
            2: 'CRM Architecture: Understanding the technical architecture and components of SAP CRM.',
            3: 'CRM Modules: Overview of sales, service, marketing, and analytics modules in SAP CRM.',
            4: 'CRM Development Tools: Tools used for customizing and extending SAP CRM functionalities.',
            5: 'CRM Configuration: Steps for configuring SAP CRM to meet business requirements.',
            6: 'CRM Testing: Techniques for testing CRM applications, including unit and integration testing.',
            7: 'CRM User Interface: Designing and customizing the CRM UI using UI configurations.',
            8: 'Advanced CRM Concepts: Deep dive into advanced topics like IPC and Trade Promotion Management.',
            9: 'Middleware Integration: Synchronizing data between SAP CRM and SAP ERP using middleware.',
            10: 'WebClient UI Framework: Customizing and enhancing the WebClient UI in SAP CRM.',
            11: 'BOL and GENIL Programming: Working with Business Object Layer and Generic Interaction Layer.',
            12: 'One Order Framework: Understanding the One Order object model in SAP CRM.',
            13: 'CRM Workflow: Implementing workflows to automate business processes in CRM.',
            14: 'CRM Web Services: Creating and consuming web services in SAP CRM.',
            15: 'CRM Mobile Applications: Developing and integrating mobile solutions with SAP CRM.'
        }
    },
    'SAP FIORI': {
        id: 'fiori',
        title: 'SAP Fiori Development',
        details: 'Select a lesson to learn more:\n1. Introduction to Fiori\n2. Setting Up Fiori Launchpad\n3. Developing Fiori Apps\n4. Building Fiori Apps\n5. Fiori Launchpad\n6. OData Services\n7. Fiori Security\n8. Extending Fiori Apps\n9. Fiori Performance Optimization\n10. Advanced Fiori Concepts\n11. SAPUI5 Fundamentals\n12. Custom Controls in SAPUI5\n13. Responsive Design\n14. Deployment of Fiori Apps\n15. Fiori Design Guidelines',
        subtopics: {
            1: 'Introduction to Fiori: Understanding SAP Fiori, its design principles, and user experience.',
            2: 'Setting Up Fiori Launchpad: Configuring the Fiori Launchpad and managing tiles and catalogs.',
            3: 'Developing Fiori Apps: Steps to create transactional, analytical, and fact sheet apps.',
            4: 'Building Fiori Apps: Using SAP Web IDE for developing and testing Fiori applications.',
            5: 'Fiori Launchpad: Customization and personalization options in the Fiori Launchpad.',
            6: 'OData Services: Creating and consuming OData services for data interaction in Fiori apps.',
            7: 'Fiori Security: Implementing authentication and authorization in Fiori applications.',
            8: 'Extending Fiori Apps: Techniques to enhance standard Fiori apps without modifying the original code.',
            9: 'Fiori Performance Optimization: Best practices for improving the performance of Fiori apps.',
            10: 'Advanced Fiori Concepts: Component reuse, MVC architecture, and advanced UI controls.',
            11: 'SAPUI5 Fundamentals: Basics of SAPUI5 framework used for Fiori app development.',
            12: 'Custom Controls in SAPUI5: Creating and using custom UI controls in SAPUI5.',
            13: 'Responsive Design: Building Fiori apps that work seamlessly across devices.',
            14: 'Deployment of Fiori Apps: Packaging and deploying Fiori apps to SAP systems.',
            15: 'Fiori Design Guidelines: Following SAP’s design guidelines for a consistent user experience.'
        }
    },
    'SAP PI-CPI': {
        id: 'pi-cpi',
        title: 'SAP PI/PO and CPI Development',
        details: 'Select a lesson to learn more:\n1. Introduction to SAP CPI\n2. Architecture of SAP CPI\n3. Integration Patterns\n4. Configuration in SAP PI\n5. Configuration in SAP CPI\n6. Message Mapping\n7. Error Handling\n8. Monitoring and Administration\n9. Security in PI/CPI\n10. Advanced CPI Concepts\n11. Adapters and Protocols\n12. API Management\n13. SAP Integration Suite\n14. Custom Adapters\n15. Migration from PI to CPI',
        subtopics: {
            1: 'Introduction to SAP CPI: Overview of SAP Cloud Platform Integration and its capabilities.',
            2: 'Architecture of SAP CPI: Understanding the components and architecture of SAP CPI.',
            3: 'Integration Patterns: Common integration patterns and scenarios in SAP CPI.',
            4: 'Configuration in SAP PI: Setting up scenarios and channels in SAP Process Integration.',
            5: 'Configuration in SAP CPI: Creating integration flows and configuring endpoints in CPI.',
            6: 'Message Mapping: Data transformation techniques using graphical and XSLT mapping.',
            7: 'Error Handling: Implementing error handling and retry mechanisms in integrations.',
            8: 'Monitoring and Administration: Tools and techniques for monitoring interfaces and handling issues.',
            9: 'Security in PI/CPI: Implementing security measures like SSL, OAuth, and SAML.',
            10: 'Advanced CPI Concepts: Scripting, value mapping, and content modifiers in CPI.',
            11: 'Adapters and Protocols: Using different adapters like HTTP, IDoc, SOAP, REST.',
            12: 'API Management: Exposing and managing APIs using SAP CPI.',
            13: 'SAP Integration Suite: Exploring the features of SAP’s comprehensive integration platform.',
            14: 'Custom Adapters: Developing custom adapters for specific integration needs.',
            15: 'Migration from PI to CPI: Strategies and best practices for migrating interfaces to CPI.'
        }
    },
    'SAP BTP': {
        id: 'btp',
        title: 'SAP Business Technology Platform Development',
        details: 'Select a lesson to learn more:\n1. Introduction to SAP BTP\n2. SAP BTP Services\n3. SAP BTP Architecture\n4. SAP BTP Integration\n5. SAP BTP Security\n6. SAP BTP Extension Suite\n7. SAP BTP Data and Analytics\n8. SAP BTP Development Tools\n9. SAP BTP Application Development\n10. Advanced SAP BTP Concepts\n11. Cloud Foundry Environment\n12. Kyma Runtime\n13. SAP BTP Workflows\n14. SAP BTP Mobile Services\n15. DevOps in SAP BTP',
        subtopics: {
            1: 'Introduction to SAP BTP: Overview of SAP Business Technology Platform and its key components.',
            2: 'SAP BTP Services: Creating and managing service instances like databases, messaging, and more.',
            3: 'SAP BTP Architecture: Understanding the architecture and environments (Neo, Cloud Foundry, Kyma).',
            4: 'SAP BTP Integration: Integrating SAP BTP with other SAP solutions and third-party services.',
            5: 'SAP BTP Security: Implementing authentication, authorization, and secure communication.',
            6: 'SAP BTP Extension Suite: Building extensions for SAP applications using the Extension Suite.',
            7: 'SAP BTP Data and Analytics: Utilizing SAP HANA Cloud, Analytics Cloud, and data management services.',
            8: 'SAP BTP Development Tools: Exploring SAP Business Application Studio and SAP Web IDE.',
            9: 'SAP BTP Application Development: Developing applications using Java, Node.js, and SAPUI5 on BTP.',
            10: 'Advanced SAP BTP Concepts: Microservices architecture, event-driven programming, and serverless functions.',
            11: 'Cloud Foundry Environment: Deploying and managing applications in the Cloud Foundry environment.',
            12: 'Kyma Runtime: Leveraging Kubernetes and extensions in SAP BTP with Kyma.',
            13: 'SAP BTP Workflows: Automating business processes using SAP Workflow Service.',
            14: 'SAP BTP Mobile Services: Developing and managing mobile applications on SAP BTP.',
            15: 'DevOps in SAP BTP: Continuous integration and delivery pipelines, monitoring, and logging.'
        }
    },
    'ABAP CDS Views': {
        id: 'cds-views',
        title: 'ABAP CDS Views',
        details: 'Select a lesson to learn more:\n1. Introduction to CDS Views\n2. Basic CDS View Creation\n3. CDS Annotations\n4. Associations in CDS\n5. CDS View Types\n6. CDS with Parameters\n7. CDS Table Functions\n8. CDS Authorizations\n9. CDS Performance\n10. CDS and SAP HANA\n11. CDS Consumption Views\n12. CDS and OData\n13. Advanced CDS Features\n14. CDS in S/4HANA\n15. Best Practices for CDS',
        subtopics: {
            1: 'Introduction to CDS Views: What are Core Data Services and their role in ABAP development.',
            2: 'Basic CDS View Creation: Creating simple CDS views and understanding the syntax.',
            3: 'CDS Annotations: Using annotations to enhance CDS views for UI, analytics, and authorizations.',
            4: 'Associations in CDS: Defining and using associations between CDS views.',
            5: 'CDS View Types: Basic, composite, consumption, and analytical CDS views.',
            6: 'CDS with Parameters: Creating parameterized CDS views for dynamic data selection.',
            7: 'CDS Table Functions: Using table functions for advanced logic in CDS.',
            8: 'CDS Authorizations: Implementing access control using DCL (Data Control Language).',
            9: 'CDS Performance: Performance considerations and optimization techniques.',
            10: 'CDS and SAP HANA: Leveraging SAP HANA features with CDS views.',
            11: 'CDS Consumption Views: Creating views for consumption in applications and analytics.',
            12: 'CDS and OData: Exposing CDS views as OData services.',
            13: 'Advanced CDS Features: Analytical privileges, currency/unit conversions, and more.',
            14: 'CDS in S/4HANA: Special features and best practices for S/4HANA.',
            15: 'Best Practices for CDS: Coding standards, naming conventions, and maintainability.'
        }
    },
    'S/4HANA Migration': {
        id: 's4hana-migration',
        title: 'S/4HANA Migration',
        details: 'Select a lesson to learn more:\n1. Introduction to S/4HANA Migration\n2. Migration Approaches\n3. System Conversion Steps\n4. Data Migration Techniques\n5. Custom Code Adaptation\n6. Simplification Item Checks\n7. Preparing for Migration\n8. Migration Tools\n9. Post-Migration Activities\n10. Best Practices and Lessons Learned\n11. Functional Changes in S/4HANA\n12. Fiori Adoption and UX\n13. Data Volume Management\n14. Integration with Cloud Solutions\n15. Continuous Improvement Post-Migration',
        subtopics: {
            1: 'Introduction to S/4HANA Migration: Overview of migration to S/4HANA and its importance.',
            2: 'Migration Approaches: Greenfield, Brownfield, and Hybrid approaches explained.',
            3: 'System Conversion Steps: Key phases and steps in a system conversion project.',
            4: 'Data Migration Techniques: Tools and strategies for migrating data to S/4HANA.',
            5: 'Custom Code Adaptation: Analyzing and adapting custom code for S/4HANA compatibility.',
            6: 'Simplification Item Checks: Using simplification lists to identify impacts on existing functionality.',
            7: 'Preparing for Migration: Technical and functional preparations required before migration.',
            8: 'Migration Tools: Utilizing tools like Software Update Manager (SUM) and Database Migration Option (DMO).',
            9: 'Post-Migration Activities: Activities after migration, including testing and performance tuning.',
            10: 'Best Practices and Lessons Learned: Insights from successful migrations and common pitfalls to avoid.',
            11: 'Functional Changes in S/4HANA: Understanding key functional differences in modules like Finance and Logistics.',
            12: 'Fiori Adoption and UX: Implementing Fiori apps and enhancing user experience post-migration.',
            13: 'Data Volume Management: Strategies for managing data growth and archiving in S/4HANA.',
            14: 'Integration with Cloud Solutions: Connecting S/4HANA with SAP Cloud Platform and other cloud services.',
            15: 'Continuous Improvement Post-Migration: Leveraging S/4HANA innovations for ongoing business improvement.'
        }
    }
};

// Exemplo de uso (mantenha seu código abaixo normalmente)
const subjectButtons = document.querySelectorAll('.subject-button');
const chatContainer = document.querySelector('.chat-container');
const subjects = {
    'ABAP RICEFW': {
        id: 'ricefw',
        title: 'ABAP RICEFW Development',
        details: 'Select a lesson to learn more:\n1. Introduction to ABAP RICEFW\n2. Data Dictionary\n3. ABAP Programming Basics\n4. ABAP Reports\n5. Internal Tables\n6. Modularization Techniques\n7. ABAP Data Types\n8. ABAP Debugging\n9. ABAP Object-Oriented Programming\n10. ALV Reports\n11. Enhancements and Modifications\n12. Batch Data Communication (BDC)\n13. SmartForms and SAPScripts\n14. User Exits and BAdIs\n15. Performance Optimization',
        subtopics: {
            1: 'Introduction to ABAP RICEFW: Overview of Reports, Interfaces, Conversions, Enhancements, Forms, and Workflows in SAP ABAP.',
            2: 'Data Dictionary: Understanding tables, data elements, domains, views, search helps, lock objects, and their significance in SAP.',
            3: 'ABAP Programming Basics: Syntax, data types, operators, control structures, and basic programming constructs.',
            4: 'ABAP Reports: Creating classical, interactive, and ALV reports with practical examples.',
            5: 'Internal Tables: Types, operations, sorting, searching, and looping through internal tables.',
            6: 'Modularization Techniques: Includes, subroutines, function modules, and methods for code reuse and organization.',
            7: 'ABAP Data Types: Elementary, reference, complex data types, and their usage in ABAP programming.',
            8: 'ABAP Debugging: Tools and techniques for debugging ABAP programs, breakpoints, watchpoints, and system debugging.',
            9: 'ABAP Object-Oriented Programming: Classes, objects, inheritance, polymorphism, interfaces, and practical implementation.',
            10: 'ALV Reports: Creating ALV (ABAP List Viewer) reports using function modules and OO methods for advanced reporting.',
            11: 'Enhancements and Modifications: User exits, customer exits, BAdIs, enhancement spots, and the enhancement framework.',
            12: 'Batch Data Communication (BDC): Techniques for data migration and automation using BDC sessions and call transactions.',
            13: 'SmartForms and SAPScripts: Designing and implementing forms for printing documents in SAP.',
            14: 'User Exits and BAdIs: Implementing custom enhancements using user exits and Business Add-Ins (BAdIs).',
            15: 'Performance Optimization: Techniques to improve the performance of ABAP programs, SQL trace, runtime analysis.'
        }
    },
    'ABAP OO': {
        id: 'oo',
        title: 'ABAP Object-Oriented Development',
        details: 'Select a lesson to learn more:\n1. Introduction to ABAP OO\n2. Classes and Objects\n3. Inheritance\n4. Polymorphism\n5. Interfaces\n6. Events\n7. Exception Handling\n8. Singleton Pattern\n9. Factory Pattern\n10. Advanced OO Concepts\n11. Design Patterns\n12. ABAP Units\n13. Persistent Objects\n14. Reflection in ABAP\n15. ABAP and SAP HANA',
        subtopics: {
            1: 'Introduction to ABAP OO: Principles of object-oriented programming in ABAP and benefits over procedural programming.',
            2: 'Classes and Objects: Defining classes, creating objects, visibility sections, and encapsulation.',
            3: 'Inheritance: Creating subclass and superclass relationships, method overriding, and code reuse.',
            4: 'Polymorphism: Implementing dynamic method dispatch and using polymorphic behaviors in ABAP OO.',
            5: 'Interfaces: Defining and implementing interfaces, multiple interface implementations.',
            6: 'Events: Creating and handling events, observer pattern implementation in ABAP OO.',
            7: 'Exception Handling: Creating and raising exceptions, handling exceptions using TRY...CATCH blocks.',
            8: 'Singleton Pattern: Implementing the Singleton design pattern in ABAP for global access to a class instance.',
            9: 'Factory Pattern: Using factory classes to create objects, abstract factory pattern in ABAP OO.',
            10: 'Advanced OO Concepts: Friends, aliases, abstract classes, and final classes in ABAP OO.',
            11: 'Design Patterns: Common design patterns and their implementation in ABAP OO.',
            12: 'ABAP Units: Writing unit tests in ABAP OO to ensure code correctness and reliability.',
            13: 'Persistent Objects: Using Object Services for persistence, managing database transactions with objects.',
            14: 'Reflection in ABAP: Runtime Type Identification (RTTI) and dynamic programming techniques.',
            15: 'ABAP and SAP HANA: Optimizing ABAP code for SAP HANA, using new features and best practices.'
        }
    },
    'ABAP BOPF': {
        id: 'bopf',
        title: 'ABAP BOPF Development',
        details: 'Select a lesson to learn more:\n1. Introduction to BOPF\n2. BOPF Architecture\n3. BOPF Meta Model\n4. Development Tools\n5. BOPF Queries\n6. Business Configuration Objects\n7. Testing and Support in BOPF\n8. Transaction and Log Management\n9. Enhancements in BOPF\n10. Error Handling\n11. Integration with SAP UI5\n12. Node.js and BOPF\n13. Security in BOPF\n14. Performance Tuning\n15. Advanced BOPF Concepts',
        subtopics: {
            1: 'Introduction to BOPF: Understanding the Business Object Processing Framework and its role in SAP’s architecture.',
            2: 'BOPF Architecture: Layers of BOPF architecture, including UI, Business Object Layer, Transaction Layer, and Database.',
            3: 'BOPF Meta Model: Structure of the business object model—nodes, actions, determinations, validations, associations.',
            4: 'Development Tools: Using SAP Internal Design Time to create, update, test, and document business objects.',
            5: 'BOPF Queries: Types of queries—node attribute query, custom query, generic result query.',
            6: 'Business Configuration Objects: Creating and managing BCOs for customizable applications.',
            7: 'Testing and Support in BOPF: Debugging tools and techniques, including core service debugging and message analysis.',
            8: 'Transaction and Log Management: Managing transactions, actions, determinations, and validations.',
            9: 'Enhancements in BOPF: Enhancing standard business objects using extensions and modifications.',
            10: 'Error Handling: Implementing error handling mechanisms in BOPF applications.',
            11: 'Integration with SAP UI5: Connecting BOPF with SAP UI5 applications for front-end development.',
            12: 'Node.js and BOPF: Integrating BOPF services with Node.js applications.',
            13: 'Security in BOPF: Implementing authorization checks and secure access to business objects.',
            14: 'Performance Tuning: Techniques to optimize BOPF applications for better performance.',
            15: 'Advanced BOPF Concepts: Deep dive into complex BOPF scenarios and best practices.'
        }
    },
    'ABAP CRM': {
        id: 'crm',
        title: 'ABAP CRM Development',
        details: 'Select a lesson to learn more:\n1. Introduction to CRM\n2. CRM Architecture\n3. CRM Modules\n4. CRM Development Tools\n5. CRM Configuration\n6. CRM Testing\n7. CRM User Interface\n8. Advanced CRM Concepts\n9. Middleware Integration\n10. WebClient UI Framework\n11. BOL and GENIL Programming\n12. One Order Framework\n13. CRM Workflow\n14. CRM Web Services\n15. CRM Mobile Applications',
        subtopics: {
            1: 'Introduction to CRM: Basics of Customer Relationship Management and its importance in businesses.',
            2: 'CRM Architecture: Understanding the technical architecture and components of SAP CRM.',
            3: 'CRM Modules: Overview of sales, service, marketing, and analytics modules in SAP CRM.',
            4: 'CRM Development Tools: Tools used for customizing and extending SAP CRM functionalities.',
            5: 'CRM Configuration: Steps for configuring SAP CRM to meet business requirements.',
            6: 'CRM Testing: Techniques for testing CRM applications, including unit and integration testing.',
            7: 'CRM User Interface: Designing and customizing the CRM UI using UI configurations.',
            8: 'Advanced CRM Concepts: Deep dive into advanced topics like IPC and Trade Promotion Management.',
            9: 'Middleware Integration: Synchronizing data between SAP CRM and SAP ERP using middleware.',
            10: 'WebClient UI Framework: Customizing and enhancing the WebClient UI in SAP CRM.',
            11: 'BOL and GENIL Programming: Working with Business Object Layer and Generic Interaction Layer.',
            12: 'One Order Framework: Understanding the One Order object model in SAP CRM.',
            13: 'CRM Workflow: Implementing workflows to automate business processes in CRM.',
            14: 'CRM Web Services: Creating and consuming web services in SAP CRM.',
            15: 'CRM Mobile Applications: Developing and integrating mobile solutions with SAP CRM.'
        }
    },
    'SAP FIORI': {
        id: 'fiori',
        title: 'SAP Fiori Development',
        details: 'Select a lesson to learn more:\n1. Introduction to Fiori\n2. Setting Up Fiori Launchpad\n3. Developing Fiori Apps\n4. Building Fiori Apps\n5. Fiori Launchpad\n6. OData Services\n7. Fiori Security\n8. Extending Fiori Apps\n9. Fiori Performance Optimization\n10. Advanced Fiori Concepts\n11. SAPUI5 Fundamentals\n12. Custom Controls in SAPUI5\n13. Responsive Design\n14. Deployment of Fiori Apps\n15. Fiori Design Guidelines',
        subtopics: {
            1: 'Introduction to Fiori: Understanding SAP Fiori, its design principles, and user experience.',
            2: 'Setting Up Fiori Launchpad: Configuring the Fiori Launchpad and managing tiles and catalogs.',
            3: 'Developing Fiori Apps: Steps to create transactional, analytical, and fact sheet apps.',
            4: 'Building Fiori Apps: Using SAP Web IDE for developing and testing Fiori applications.',
            5: 'Fiori Launchpad: Customization and personalization options in the Fiori Launchpad.',
            6: 'OData Services: Creating and consuming OData services for data interaction in Fiori apps.',
            7: 'Fiori Security: Implementing authentication and authorization in Fiori applications.',
            8: 'Extending Fiori Apps: Techniques to enhance standard Fiori apps without modifying the original code.',
            9: 'Fiori Performance Optimization: Best practices for improving the performance of Fiori apps.',
            10: 'Advanced Fiori Concepts: Component reuse, MVC architecture, and advanced UI controls.',
            11: 'SAPUI5 Fundamentals: Basics of SAPUI5 framework used for Fiori app development.',
            12: 'Custom Controls in SAPUI5: Creating and using custom UI controls in SAPUI5.',
            13: 'Responsive Design: Building Fiori apps that work seamlessly across devices.',
            14: 'Deployment of Fiori Apps: Packaging and deploying Fiori apps to SAP systems.',
            15: 'Fiori Design Guidelines: Following SAP’s design guidelines for a consistent user experience.'
        }
    },
    'SAP PI-CPI': {
        id: 'pi-cpi',
        title: 'SAP PI/PO and CPI Development',
        details: 'Select a lesson to learn more:\n1. Introduction to SAP CPI\n2. Architecture of SAP CPI\n3. Integration Patterns\n4. Configuration in SAP PI\n5. Configuration in SAP CPI\n6. Message Mapping\n7. Error Handling\n8. Monitoring and Administration\n9. Security in PI/CPI\n10. Advanced CPI Concepts\n11. Adapters and Protocols\n12. API Management\n13. SAP Integration Suite\n14. Custom Adapters\n15. Migration from PI to CPI',
        subtopics: {
            1: 'Introduction to SAP CPI: Overview of SAP Cloud Platform Integration and its capabilities.',
            2: 'Architecture of SAP CPI: Understanding the components and architecture of SAP CPI.',
            3: 'Integration Patterns: Common integration patterns and scenarios in SAP CPI.',
            4: 'Configuration in SAP PI: Setting up scenarios and channels in SAP Process Integration.',
            5: 'Configuration in SAP CPI: Creating integration flows and configuring endpoints in CPI.',
            6: 'Message Mapping: Data transformation techniques using graphical and XSLT mapping.',
            7: 'Error Handling: Implementing error handling and retry mechanisms in integrations.',
            8: 'Monitoring and Administration: Tools and techniques for monitoring interfaces and handling issues.',
            9: 'Security in PI/CPI: Implementing security measures like SSL, OAuth, and SAML.',
            10: 'Advanced CPI Concepts: Scripting, value mapping, and content modifiers in CPI.',
            11: 'Adapters and Protocols: Using different adapters like HTTP, IDoc, SOAP, REST.',
            12: 'API Management: Exposing and managing APIs using SAP CPI.',
            13: 'SAP Integration Suite: Exploring the features of SAP’s comprehensive integration platform.',
            14: 'Custom Adapters: Developing custom adapters for specific integration needs.',
            15: 'Migration from PI to CPI: Strategies and best practices for migrating interfaces to CPI.'
        }
    },
    'SAP BTP': {
        id: 'btp',
        title: 'SAP Business Technology Platform Development',
        details: 'Select a lesson to learn more:\n1. Introduction to SAP BTP\n2. SAP BTP Services\n3. SAP BTP Architecture\n4. SAP BTP Integration\n5. SAP BTP Security\n6. SAP BTP Extension Suite\n7. SAP BTP Data and Analytics\n8. SAP BTP Development Tools\n9. SAP BTP Application Development\n10. Advanced SAP BTP Concepts\n11. Cloud Foundry Environment\n12. Kyma Runtime\n13. SAP BTP Workflows\n14. SAP BTP Mobile Services\n15. DevOps in SAP BTP',
        subtopics: {
            1: 'Introduction to SAP BTP: Overview of SAP Business Technology Platform and its key components.',
            2: 'SAP BTP Services: Creating and managing service instances like databases, messaging, and more.',
            3: 'SAP BTP Architecture: Understanding the architecture and environments (Neo, Cloud Foundry, Kyma).',
            4: 'SAP BTP Integration: Integrating SAP BTP with other SAP solutions and third-party services.',
            5: 'SAP BTP Security: Implementing authentication, authorization, and secure communication.',
            6: 'SAP BTP Extension Suite: Building extensions for SAP applications using the Extension Suite.',
            7: 'SAP BTP Data and Analytics: Utilizing SAP HANA Cloud, Analytics Cloud, and data management services.',
            8: 'SAP BTP Development Tools: Exploring SAP Business Application Studio and SAP Web IDE.',
            9: 'SAP BTP Application Development: Developing applications using Java, Node.js, and SAPUI5 on BTP.',
            10: 'Advanced SAP BTP Concepts: Microservices architecture, event-driven programming, and serverless functions.',
            11: 'Cloud Foundry Environment: Deploying and managing applications in the Cloud Foundry environment.',
            12: 'Kyma Runtime: Leveraging Kubernetes and extensions in SAP BTP with Kyma.',
            13: 'SAP BTP Workflows: Automating business processes using SAP Workflow Service.',
            14: 'SAP BTP Mobile Services: Developing and managing mobile applications on SAP BTP.',
            15: 'DevOps in SAP BTP: Continuous integration and delivery pipelines, monitoring, and logging.'
        }
    },
    'ABAP CDS Views': {
        id: 'cds-views',
        title: 'ABAP CDS Views',
        details: 'Select a lesson to learn more:\n1. Introduction to CDS Views\n2. Basic CDS View Creation\n3. CDS Annotations\n4. Associations in CDS\n5. CDS View Types\n6. CDS with Parameters\n7. CDS Table Functions\n8. CDS Authorizations\n9. CDS Performance\n10. CDS and SAP HANA\n11. CDS Consumption Views\n12. CDS and OData\n13. Advanced CDS Features\n14. CDS in S/4HANA\n15. Best Practices for CDS',
        subtopics: {
            1: 'Introduction to CDS Views: What are Core Data Services and their role in ABAP development.',
            2: 'Basic CDS View Creation: Creating simple CDS views and understanding the syntax.',
            3: 'CDS Annotations: Using annotations to enhance CDS views for UI, analytics, and authorizations.',
            4: 'Associations in CDS: Defining and using associations between CDS views.',
            5: 'CDS View Types: Basic, composite, consumption, and analytical CDS views.',
            6: 'CDS with Parameters: Creating parameterized CDS views for dynamic data selection.',
            7: 'CDS Table Functions: Using table functions for advanced logic in CDS.',
            8: 'CDS Authorizations: Implementing access control using DCL (Data Control Language).',
            9: 'CDS Performance: Performance considerations and optimization techniques.',
            10: 'CDS and SAP HANA: Leveraging SAP HANA features with CDS views.',
            11: 'CDS Consumption Views: Creating views for consumption in applications and analytics.',
            12: 'CDS and OData: Exposing CDS views as OData services.',
            13: 'Advanced CDS Features: Analytical privileges, currency/unit conversions, and more.',
            14: 'CDS in S/4HANA: Special features and best practices for S/4HANA.',
            15: 'Best Practices for CDS: Coding standards, naming conventions, and maintainability.'
        }
    },
    'S/4HANA Migration': {
        id: 's4hana-migration',
        title: 'S/4HANA Migration',
        details: 'Select a lesson to learn more:\n1. Introduction to S/4HANA Migration\n2. Migration Approaches\n3. System Conversion Steps\n4. Data Migration Techniques\n5. Custom Code Adaptation\n6. Simplification Item Checks\n7. Preparing for Migration\n8. Migration Tools\n9. Post-Migration Activities\n10. Best Practices and Lessons Learned\n11. Functional Changes in S/4HANA\n12. Fiori Adoption and UX\n13. Data Volume Management\n14. Integration with Cloud Solutions\n15. Continuous Improvement Post-Migration',
        subtopics: {
            1: 'Introduction to S/4HANA Migration: Overview of migration to S/4HANA and its importance.',
            2: 'Migration Approaches: Greenfield, Brownfield, and Hybrid approaches explained.',
            3: 'System Conversion Steps: Key phases and steps in a system conversion project.',
            4: 'Data Migration Techniques: Tools and strategies for migrating data to S/4HANA.',
            5: 'Custom Code Adaptation: Analyzing and adapting custom code for S/4HANA compatibility.',
            6: 'Simplification Item Checks: Using simplification lists to identify impacts on existing functionality.',
            7: 'Preparing for Migration: Technical and functional preparations required before migration.',
            8: 'Migration Tools: Utilizing tools like Software Update Manager (SUM) and Database Migration Option (DMO).',
            9: 'Post-Migration Activities: Activities after migration, including testing and performance tuning.',
            10: 'Best Practices and Lessons Learned: Insights from successful migrations and common pitfalls to avoid.',
            11: 'Functional Changes in S/4HANA: Understanding key functional differences in modules like Finance and Logistics.',
            12: 'Fiori Adoption and UX: Implementing Fiori apps and enhancing user experience post-migration.',
            13: 'Data Volume Management: Strategies for managing data growth and archiving in S/4HANA.',
            14: 'Integration with Cloud Solutions: Connecting S/4HANA with SAP Cloud Platform and other cloud services.',
            15: 'Continuous Improvement Post-Migration: Leveraging S/4HANA innovations for ongoing business improvement.'
        }
    }
};


const subjectButtons = document.querySelectorAll('.subject-button');
const chatContainer = document.querySelector('.chat-container');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const chatSendButton = document.querySelector('.chat-input button');
const backButton = document.querySelector('.back-button');

let currentSubject = '';
let currentTopic = '';
let currentSubtopic = '';

// Authentication check when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Event initialization
    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

subjectButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentSubject = button.dataset.subject;
        chatContainer.style.display = 'flex';
        document.querySelector('.subject-buttons').style.display = 'none';
        showTopics();
    });
});

function showTopics() {
    const topicList = document.createElement('ol');
    topicList.classList.add('topic-list');

    const topicLines = subjects[currentSubject].details.split('\n');
    topicLines.forEach((line, index) => {
        if (index === 0) return; // Skip the first line
        const topicItem = document.createElement('li');
        topicItem.classList.add('topic-item');
        topicItem.innerHTML = `<i class="fas fa-book"></i> ${line}`;
        topicItem.addEventListener('click', () =>
            showSubtopics(line.split('. ')[1])
        );
        topicList.appendChild(topicItem);
    });

    chatMessages.innerHTML = '';
    chatMessages.appendChild(topicList);
}

function showSubtopics(topic) {
    currentTopic = topic;
    const subtopicList = document.createElement('ol');
    subtopicList.classList.add('subtopic-list');

    Object.entries(subjects[currentSubject].subtopics).forEach(([key, value]) => {
        const subtopicItem = document.createElement('li');
        subtopicItem.classList.add('subtopic-item');
        subtopicItem.innerHTML = `<i class="fas fa-chevron-right"></i> ${
      value.split(': ')[0]
    }`;
        subtopicItem.addEventListener('click', () => startLesson(value));
        subtopicList.appendChild(subtopicItem);
    });

    chatMessages.innerHTML = '';
    chatMessages.appendChild(subtopicList);
}

function startLesson(subtopic) {
    currentSubtopic = subtopic;
    console.log(`Subtopic updated: ${currentSubtopic}`); // For debugging
    chatMessages.innerHTML = '';
    getAIResponse(
        `Start a lesson and explain ${currentSubject}: ${currentTopic} - ${currentSubtopic}.`
    );
}

const initialPrompt = {
    role: 'system',
    content: `You have been trained based on pedagogical principles that emphasize dialogue, critical reflection, and connecting with the student's reality. 
Your role is to teach ${currentSubject}, focusing on the topic "${currentTopic}" and the subtopic "${currentSubtopic}". 
Adapt to the student's communication style, knowledge level, and context, always promoting active knowledge construction and preparing them for SAP technology challenges.
**Important:** You must **not mention Paulo Freire** or make any direct reference to the fact that your approach is based on his theories, unless the student specifically asks about it.

## Lesson Structure Based on Guidelines

### 1. Language Adaptation and Complexity
- Begin with simple and direct language, adjusting your vocabulary based on the student's responses. Increase complexity gradually as the student demonstrates understanding.
- Maintain an educational and encouraging tone, always attentive to the student's communication style to create a welcoming and respectful environment.

### 2. Contextualization and Connection to Reality
- Start the conversation by asking about the student's experiences related to the topic. Ask:
  - **For SAP technology subjects**: "Have you ever used ${currentSubtopic} in a practical situation, such as in your daily work with SAP systems? How was that experience?"
- Use real-world examples to explain complex concepts, connecting learning to the student's professional context.

### 3. Dialogue and Collaborative Construction
- Pose open-ended questions that encourage the student to think and share their ideas:
  - "How do you understand this concept? What do you think it could change in the way you approach your projects?"
- Value the student's contributions and use them to develop the conversation, promoting collaborative knowledge construction.

### 4. Critical Thinking and Reflection
- Present situations that encourage the student to question their own ideas and the SAP methodologies:
  - "Do you think this concept could be applied differently in your environment? What would change depending on how we implement it?"
- Encourage the student to analyze different perspectives on the topic, promoting critical thinking.

### 5. Practical Application and Transformation
- Discuss how the knowledge can be applied in the student's professional life:
  - "How could you use this concept of ${currentSubtopic} to solve a practical problem you've encountered in SAP implementations?"
- Encourage the student to think of ways to use what they've learned to improve their work processes, becoming an agent of change.

### 6. Respect for Context and Prior Knowledge
- Be attentive to the professional experiences the student brings. Integrate their prior knowledge with the new information presented:
  - "How does this connect with what you already know about the topic? Do you see any similarities with previous projects you've worked on?"

### 7. Encouraging Autonomy and Curiosity
- Encourage the student to seek more information on their own and suggest ways to expand their learning:
  - "If you want to delve deeper, what other SAP modules or technologies do you think relate to this?"
- Provide practical suggestions on how the student can continue their learning independently.

### 8. Preparation for Professional Challenges
- Relate the content to possible scenarios in SAP certifications or workplace applications, but in a natural and contextualized way:
  - "This concept is often tested in SAP certification exams. Let's work through a practical example that can help you prepare."
  
---

**Note:** Your role is to facilitate the learning process in an open, inclusive, and critical manner, always adapting to the student's context and knowledge level. Promote constant inquiry, practical application of knowledge, and prepare the student for professional challenges in a natural way connected to their reality. **Never mention Paulo Freire unless the student asks directly.**
		`,
};

// Initialize the conversationHistory variable
let conversationHistory = [];

// Function to add a message to the history
function addToConversationHistory(role, content) {
    conversationHistory.push({
        role: role,
        content: content
    });
}

// Main function that checks authentication and balance before obtaining the AI response
async function handleAIRequest(message) {
    try {
        const userId = await checkAuthState();
        const hasSaldoMensagens = await checkSaldoMensagens(userId); //

        if (!userId) {
            alert('User is not logged in. Redirecting to the login page.');
            window.location.href = '/index.html'; // Redirect to the login page if not logged in
            return;
        }

        if (!hasSaldoMensagens) {
            addMessage('ai', 'You do not have enough balance to proceed.');
            return; // Stop execution if balance is insufficient
        }
        addToConversationHistory('user', message); // Add the user's message to the history

        await getAIResponse(message, hasSaldoMensagens); // Call the function to get the AI response
    } catch (error) {
        console.error('Error sending message:', error);
        addMessage('ai', error.message); // Display the error message to the user
    }
}

// Assuming the `addMessage` function is already defined to add messages to the chat
function addMessage(sender, content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);

    // Use the `marked.parse` function to process the content as Markdown
    messageElement.innerHTML = marked.parse(content);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
    try {
        const userId = await checkAuthState();
        const hasSaldoMensagens = await checkSaldoMensagens(userId);

        if (!hasSaldoMensagens) {
            displayMessage(
                'You do not have enough message balance to proceed.'
            );
            return;
        }

        addMessage('ai', 'Processing your request...');
        // Add the initial prompt before sending the conversation to the API
        if (conversationHistory.length === 0) {
            const specificPrompt = {
                role: 'system',
                content: `You were trained based on Paulo Freire's pedagogical principles, emphasizing dialogue, critical reflection, and connection with the medical student's reality.
Focus specifically on the topic "${currentTopic}" within ${currentSubject} and the subtopic "${currentSubtopic}".`,
            };
            addToConversationHistory('system', initialPrompt.content);
        }

        const userMessage = {
            role: 'user',
            content: message, //`Please explain about ${currentSubject}: ${currentTopic} - ${currentSubtopic}. ${message}`
        };

        addToConversationHistory('user', userMessage.content);

        // const messagesToSend = [specificPrompt, userMessage];
        const assistantId = 'asst_qKw62JCa2JMEW9hi4e6cyi5t';
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Allowed model on your list
                max_tokens: 4000,
                temperature: 0.5,
                messages: conversationHistory,

            }),
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Add the AI response to the conversation history
        addToConversationHistory('assistant', aiResponse);

        chatMessages.removeChild(chatMessages.lastChild);

        addMessage('ai', aiResponse); // Display the AI response in the chat
    } catch (error) {
        console.error('Error getting AI response:', error);
        // Remove the processing message
        chatMessages.removeChild(chatMessages.lastChild);
        addMessage(
            'ai',
            'Sorry, an error occurred while processing your request. Please try again later.'
        );
    }
}

// Function to clear the chat when returning to the previous screen
function clearChat() {
    chatMessages.innerHTML = ''; // Clears the message area
    chatInput.value = ''; // Clears the text input field
    conversationHistory = []; // Clears the conversation history
}
// Click events
chatSendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
// Main function that sends the message and gets a response
async function sendMessage() {
    try {
        const message = chatInput.value.trim();
        if (message) {
            const contextualMessage = `[Context: ${currentSubject} - ${currentTopic} - ${currentSubtopic}] ${message}`;
            addMessage('user', message);
            chatInput.value = '';
            await handleAIRequest(contextualMessage);
        }
    } catch (error) {
        console.error('Error sending the message:', error);
        addMessage(
            'ai',
            'Sorry, there was an error sending your message. Please try again.'
        );
    }
}

// Click and back button handling events
backButton.addEventListener('click', () => {
    clearChat();
    chatContainer.style.display = 'none';
    document.querySelector('.subject-buttons').style.display = 'grid';
    currentSubject = '';
    currentTopic = '';
    currentSubtopic = '';
});

// Footer navigation
const footerLinks = document.querySelectorAll('.footer-nav a');
footerLinks.forEach(link => {
    // Check if the link matches the current location
    if (link.href === window.location.href) {
        link.classList.add('active');
    }

    link.addEventListener('click', () => {
        footerLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        // Let the navigation occur naturally
    });
});