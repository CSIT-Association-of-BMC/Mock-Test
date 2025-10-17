import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // Create Subjects
    const subjects = [
        'Physics',
        'Chemistry',
        'Mathematics',
        'English',
        'Computer Science'
    ];

    for (const subjectName of subjects) {
        await prisma.subject.upsert({
            where: { name: subjectName },
            update: {},
            create: { name: subjectName },
        });
    }

    console.log('✓ Created subjects');

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.upsert({
        where: { email: 'admin@csitabmc.com' },
        update: {},
        create: {
            email: 'admin@csitabmc.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('✓ Created default admin (email: admin@csitabmc.com, password: admin123)');

    // Create a question set for full mock test
    const questionSet = await prisma.questionSet.upsert({
        where: { setName: 'CSIT ABMC Full Mock Test 2024' },
        update: {},
        create: {
            setName: 'CSIT ABMC Full Mock Test 2024',
            isActive: true,
        },
    });

    console.log('✓ Created question set');

    // Get all subjects
    const physics = await prisma.subject.findUnique({ where: { name: 'Physics' } });
    const chemistry = await prisma.subject.findUnique({ where: { name: 'Chemistry' } });
    const mathematics = await prisma.subject.findUnique({ where: { name: 'Mathematics' } });
    const english = await prisma.subject.findUnique({ where: { name: 'English' } });
    const computerScience = await prisma.subject.findUnique({ where: { name: 'Computer Science' } });

    if (!physics || !chemistry || !mathematics || !english || !computerScience) {
        throw new Error('One or more subjects not found');
    }

    // Generate questions for each subject (20 questions each = 100 total)
    const allQuestions = [
        ...generatePhysicsQuestions(physics.id, questionSet.id),
        ...generateChemistryQuestions(chemistry.id, questionSet.id),
        ...generateMathematicsQuestions(mathematics.id, questionSet.id),
        ...generateEnglishQuestions(english.id, questionSet.id),
        ...generateComputerScienceQuestions(computerScience.id, questionSet.id),
    ];

    for (const question of allQuestions) {
        await prisma.question.create({
            data: question,
        });
    }

    console.log('✓ Created 100 questions across all subjects (20 each)');

    console.log('Database seeding completed!');
}

function generatePhysicsQuestions(subjectId: string, questionSetId: string) {
    const questions = [];

    const physicsQuestions = [
        { question: 'What is the SI unit of force?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], answer: 0 },
        { question: 'Which law states that for every action there is an equal and opposite reaction?', options: ['First law', 'Second law', 'Third law', 'Fourth law'], answer: 2 },
        { question: 'What is the acceleration due to gravity on Earth?', options: ['8.9 m/s²', '9.8 m/s²', '10.2 m/s²', '7.8 m/s²'], answer: 1 },
        { question: 'What is the speed of light in vacuum?', options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁷ m/s'], answer: 0 },
        { question: 'Which particle has a negative charge?', options: ['Proton', 'Neutron', 'Electron', 'Photon'], answer: 2 },
        { question: 'What is the formula for kinetic energy?', options: ['1/2 mv²', 'mgh', '1/2 kx²', 'mc²'], answer: 0 },
        { question: 'Which lens converges light rays?', options: ['Concave', 'Convex', 'Plane', 'Cylindrical'], answer: 1 },
        { question: 'What is the boiling point of water at standard pressure?', options: ['90°C', '100°C', '110°C', '120°C'], answer: 1 },
        { question: 'Which principle explains the working of a hydraulic lift?', options: ['Archimedes', 'Pascal', 'Bernoulli', 'Newton'], answer: 1 },
        { question: 'What is the unit of electric current?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], answer: 1 },
        { question: 'Which wave has the longest wavelength?', options: ['Gamma', 'X-ray', 'Radio', 'Ultraviolet'], answer: 2 },
        { question: 'What is the mass of an electron?', options: ['9.1 × 10⁻³¹ kg', '1.67 × 10⁻²⁷ kg', '1.67 × 10⁻³¹ kg', '9.1 × 10⁻²⁷ kg'], answer: 0 },
        { question: 'Which gas is used in electric bulbs?', options: ['Oxygen', 'Nitrogen', 'Argon', 'Helium'], answer: 2 },
        { question: 'What is the focal length of a plane mirror?', options: ['Zero', 'Infinity', 'Negative', 'Positive'], answer: 1 },
        { question: 'Which device converts AC to DC?', options: ['Transformer', 'Rectifier', 'Inductor', 'Capacitor'], answer: 1 },
        { question: 'What is the formula for Ohm\'s law?', options: ['V = IR', 'P = VI', 'F = ma', 'E = mc²'], answer: 0 },
        { question: 'Which metal is the best conductor of electricity?', options: ['Iron', 'Copper', 'Aluminum', 'Silver'], answer: 3 },
        { question: 'What is the unit of power?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], answer: 1 },
        { question: 'Which phenomenon causes rainbow formation?', options: ['Reflection', 'Refraction', 'Dispersion', 'Diffraction'], answer: 2 },
        { question: 'What is the escape velocity from Earth?', options: ['7.9 km/s', '11.2 km/s', '15.6 km/s', '9.8 km/s'], answer: 1 },
    ];

    for (const q of physicsQuestions) {
        questions.push({
            text: q.question,
            options: q.options,
            correctAnswerIndex: q.answer,
            subjectId,
            questionSetId,
        });
    }

    return questions;
}

function generateChemistryQuestions(subjectId: string, questionSetId: string) {
    const questions = [];

    const chemistryQuestions = [
        { question: 'What is the atomic number of Carbon?', options: ['5', '6', '7', '8'], answer: 1 },
        { question: 'Which gas is produced during photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], answer: 0 },
        { question: 'What is the pH of pure water?', options: ['5', '7', '9', '14'], answer: 1 },
        { question: 'Which element has the highest electronegativity?', options: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], answer: 0 },
        { question: 'What is the molecular formula of water?', options: ['H2', 'H2O', 'HO', 'H2O2'], answer: 1 },
        { question: 'Which type of bond is formed by sharing electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], answer: 1 },
        { question: 'What is the valency of Sodium?', options: ['1', '2', '3', '4'], answer: 0 },
        { question: 'Which acid is present in vinegar?', options: ['Sulfuric', 'Hydrochloric', 'Acetic', 'Nitric'], answer: 2 },
        { question: 'What is the chemical name of baking soda?', options: ['Sodium chloride', 'Sodium bicarbonate', 'Sodium carbonate', 'Sodium hydroxide'], answer: 1 },
        { question: 'Which gas is responsible for global warming?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], answer: 2 },
        { question: 'What is the molecular weight of CO2?', options: ['28', '32', '44', '48'], answer: 2 },
        { question: 'Which element is liquid at room temperature?', options: ['Mercury', 'Bromine', 'Gallium', 'Cesium'], answer: 0 },
        { question: 'What is the oxidation state of oxygen in H2O?', options: ['-1', '-2', '+1', '+2'], answer: 1 },
        { question: 'Which compound is used as an antacid?', options: ['NaOH', 'HCl', 'Mg(OH)2', 'H2SO4'], answer: 2 },
        { question: 'What is the chemical formula of table salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], answer: 0 },
        { question: 'Which gas is produced when metal reacts with acid?', options: ['Oxygen', 'Hydrogen', 'Nitrogen', 'Carbon dioxide'], answer: 1 },
        { question: 'What is the pH of blood?', options: ['4.5', '7.4', '9.2', '12.5'], answer: 1 },
        { question: 'Which element has atomic number 1?', options: ['Helium', 'Hydrogen', 'Lithium', 'Beryllium'], answer: 1 },
        { question: 'What is the chemical name of limestone?', options: ['CaO', 'Ca(OH)2', 'CaCO3', 'CaSO4'], answer: 2 },
        { question: 'Which type of reaction releases energy?', options: ['Endothermic', 'Exothermic', 'Neutralization', 'Precipitation'], answer: 1 },
    ];

    for (const q of chemistryQuestions) {
        questions.push({
            text: q.question,
            options: q.options,
            correctAnswerIndex: q.answer,
            subjectId,
            questionSetId,
        });
    }

    return questions;
}

function generateMathematicsQuestions(subjectId: string, questionSetId: string) {
    const questions = [];

    const mathQuestions = [
        { question: 'What is the value of π (pi) approximately?', options: ['3.14', '3.41', '4.13', '2.71'], answer: 0 },
        { question: 'What is the square root of 144?', options: ['10', '12', '14', '16'], answer: 1 },
        { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], answer: 1 },
        { question: 'What is the area of a circle with radius 7?', options: ['154', '44', '88', '22'], answer: 0 },
        { question: 'What is the probability of rolling a 6 on a fair die?', options: ['1/2', '1/3', '1/6', '1/4'], answer: 2 },
        { question: 'What is the sum of angles in a triangle?', options: ['180°', '360°', '90°', '270°'], answer: 0 },
        { question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: 2 },
        { question: 'What is the integral of 2x?', options: ['x²', 'x² + C', '2x²', '2x² + C'], answer: 1 },
        { question: 'What is the mode of {1, 2, 2, 3, 4}?', options: ['1', '2', '3', '4'], answer: 1 },
        { question: 'What is the value of log₁₀(100)?', options: ['1', '2', '10', '100'], answer: 1 },
        { question: 'What is the slope of y = 3x + 2?', options: ['2', '3', '1', '0'], answer: 1 },
        { question: 'What is the circumference of a circle with diameter 10?', options: ['10π', '20π', '5π', '15π'], answer: 1 },
        { question: 'What is the factorial of 5?', options: ['120', '60', '24', '720'], answer: 0 },
        { question: 'What is the median of {1, 3, 5, 7, 9}?', options: ['3', '5', '7', '9'], answer: 1 },
        { question: 'What is sin(90°)?', options: ['0', '1', '0.5', '-1'], answer: 1 },
        { question: 'What is the volume of a cube with side 3?', options: ['9', '18', '27', '36'], answer: 2 },
        { question: 'What is the range of {2, 5, 8, 3, 6}?', options: ['3', '5', '6', '8'], answer: 2 },
        { question: 'What is 2³?', options: ['6', '8', '9', '12'], answer: 1 },
        { question: 'What is the cosine of 0°?', options: ['0', '1', '0.5', '-1'], answer: 1 },
        { question: 'What is the perimeter of a square with side 4?', options: ['8', '12', '16', '20'], answer: 2 },
    ];

    for (const q of mathQuestions) {
        questions.push({
            text: q.question,
            options: q.options,
            correctAnswerIndex: q.answer,
            subjectId,
            questionSetId,
        });
    }

    return questions;
}

function generateEnglishQuestions(subjectId: string, questionSetId: string) {
    const questions = [];

    const englishQuestions = [
        { question: 'Choose the correct spelling:', options: ['Recieve', 'Receive', 'Receeve', 'Recive'], answer: 1 },
        { question: 'What is the synonym of "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], answer: 1 },
        { question: 'Choose the correct article: "___ apple a day keeps the doctor away"', options: ['A', 'An', 'The', 'No article'], answer: 1 },
        { question: 'What is the past tense of "go"?', options: ['Goed', 'Went', 'Gone', 'Going'], answer: 1 },
        { question: 'Choose the correct preposition: "I am interested ___ mathematics"', options: ['at', 'in', 'on', 'with'], answer: 1 },
        { question: 'What does "ubiquitous" mean?', options: ['Rare', 'Present everywhere', 'Beautiful', 'Dangerous'], answer: 1 },
        { question: 'Choose the correct form: "She ___ to school every day"', options: ['go', 'goes', 'going', 'gone'], answer: 1 },
        { question: 'What is an antonym of "brave"?', options: ['Cowardly', 'Strong', 'Smart', 'Fast'], answer: 0 },
        { question: 'Choose the correct sentence:', options: ['He don\'t like apples', 'He doesn\'t likes apples', 'He doesn\'t like apples', 'He don\'t likes apples'], answer: 2 },
        { question: 'What does "ephemeral" mean?', options: ['Eternal', 'Short-lived', 'Colorful', 'Heavy'], answer: 1 },
        { question: 'Choose the correct word: "The weather is ___ today"', options: ['sunny', 'sunnily', 'sun', 'sunned'], answer: 0 },
        { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Childrens'], answer: 1 },
        { question: 'Choose the correct idiom: "Break ___"', options: ['a leg', 'the ice', 'the news', 'the bank'], answer: 0 },
        { question: 'What does "gregarious" mean?', options: ['Shy', 'Sociable', 'Lazy', 'Intelligent'], answer: 1 },
        { question: 'Choose the correct tense: "I ___ my homework yesterday"', options: ['do', 'did', 'done', 'doing'], answer: 1 },
        { question: 'What is a synonym of "enormous"?', options: ['Tiny', 'Huge', 'Slow', 'Quiet'], answer: 1 },
        { question: 'Choose the correct word order: "___ you like tea?"', options: ['Do', 'Does', 'Are', 'Is'], answer: 0 },
        { question: 'What does "voracious" mean?', options: ['Sleepy', 'Having great appetite', 'Clean', 'Fast'], answer: 1 },
        { question: 'Choose the correct form: "They ___ playing football"', options: ['is', 'are', 'was', 'were'], answer: 1 },
        { question: 'What is the comparative form of "good"?', options: ['Gooder', 'Better', 'Best', 'Goodest'], answer: 1 },
    ];

    for (const q of englishQuestions) {
        questions.push({
            text: q.question,
            options: q.options,
            correctAnswerIndex: q.answer,
            subjectId,
            questionSetId,
        });
    }

    return questions;
}

function generateComputerScienceQuestions(subjectId: string, questionSetId: string) {
    const questions = [];

    const csQuestions = [
        { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], answer: 0 },
        { question: 'Which language is known as the mother of all languages?', options: ['C', 'C++', 'Java', 'Python'], answer: 0 },
        { question: 'What is the time complexity of bubble sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2 },
        { question: 'Which data structure uses FIFO principle?', options: ['Stack', 'Queue', 'Array', 'Tree'], answer: 1 },
        { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Modern Language', 'High Text Markup Language'], answer: 0 },
        { question: 'Which of the following is not a programming paradigm?', options: ['Object-oriented', 'Functional', 'Procedural', 'Algorithmic'], answer: 3 },
        { question: 'What is the binary representation of decimal 10?', options: ['1010', '1001', '1100', '1110'], answer: 0 },
        { question: 'Which SQL command is used to retrieve data?', options: ['INSERT', 'UPDATE', 'DELETE', 'SELECT'], answer: 3 },
        { question: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Open Object Programming', 'Online Object Programming', 'Optimized Object Programming'], answer: 0 },
        { question: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 2 },
        { question: 'What is the purpose of an operating system?', options: ['Run applications', 'Manage hardware', 'Both A and B', 'None of the above'], answer: 2 },
        { question: 'Which sorting algorithm is the fastest in practice?', options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'], answer: 1 },
        { question: 'What does RAM stand for?', options: ['Random Access Memory', 'Read Access Memory', 'Random Available Memory', 'Read Available Memory'], answer: 0 },
        { question: 'Which of the following is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], answer: 2 },
        { question: 'What is the main function of a compiler?', options: ['Execute code', 'Translate code', 'Debug code', 'Optimize code'], answer: 1 },
        { question: 'Which data structure is used for implementing recursion?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
        { question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Program Interface', 'Advanced Program Interface'], answer: 0 },
        { question: 'Which of the following is not a valid variable name in most languages?', options: ['myVar', 'my_var', 'my-var', 'myVar123'], answer: 2 },
        { question: 'What is the purpose of normalization in databases?', options: ['Reduce redundancy', 'Increase speed', 'Both A and B', 'None of the above'], answer: 0 },
        { question: 'Which algorithm is used for finding shortest path?', options: ['Binary Search', 'Dijkstra\'s', 'Bubble Sort', 'Quick Sort'], answer: 1 },
    ];

    for (const q of csQuestions) {
        questions.push({
            text: q.question,
            options: q.options,
            correctAnswerIndex: q.answer,
            subjectId,
            questionSetId,
        });
    }

    return questions;
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
