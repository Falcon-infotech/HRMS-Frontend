import { format, subMonths } from 'date-fns';
import employeesData from './employeeData';

// Interface for performance review
export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  reviewPeriod: string;
  reviewDate: string;
  status: 'draft' | 'submitted' | 'acknowledged' | 'finalized';
  overallRating: number;
  sections: PerformanceSection[];
  goals: PerformanceGoal[];
  strengths: string[];
  improvements: string[];
  comments: string;
  acknowledgement?: {
    date: string;
    comments: string;
  };
}

// Interface for performance section
export interface PerformanceSection {
  name: string;
  description: string;
  rating: number;
  comments: string;
}

// Interface for performance goal
export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  targetDate: string;
  completionDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'deferred';
  progress: number;
  category: 'development' | 'business' | 'personal';
  priority: 'low' | 'medium' | 'high';
  comments: string;
}

// Performance review sections
export const reviewSections = [
  {
    name: 'Job Knowledge',
    description: 'Understanding of job responsibilities, procedures, and technical skills'
  },
  {
    name: 'Quality of Work',
    description: 'Accuracy, thoroughness, and effectiveness of work performed'
  },
  {
    name: 'Productivity',
    description: 'Amount of work completed relative to expectations'
  },
  {
    name: 'Communication',
    description: 'Effectiveness in expressing ideas and information'
  },
  {
    name: 'Teamwork',
    description: 'Ability to work effectively with others'
  },
  {
    name: 'Problem Solving',
    description: 'Ability to identify, analyze, and resolve problems'
  },
  {
    name: 'Initiative',
    description: 'Self-motivation and willingness to take on responsibilities'
  },
  {
    name: 'Adaptability',
    description: 'Ability to adjust to changing conditions and new challenges'
  }
];

// Generate random strengths
const strengthOptions = [
  'Excellent communication skills',
  'Strong technical knowledge',
  'Great team player',
  'Takes initiative',
  'Problem-solving abilities',
  'Attention to detail',
  'Customer-focused',
  'Adaptable to change',
  'Leadership qualities',
  'Time management',
  'Innovative thinking',
  'Positive attitude',
  'Analytical skills',
  'Meeting deadlines consistently',
  'Quick learner'
];

// Generate random improvements
const improvementOptions = [
  'Work on time management skills',
  'Improve delegation of tasks',
  'Develop stronger presentation skills',
  'Enhance technical knowledge',
  'Focus on detailed documentation',
  'Improve communication with team members',
  'Work on project planning',
  'Develop conflict resolution skills',
  'Take more initiative',
  'Learn to prioritize tasks effectively',
  'Improve attention to detail',
  'Work on handling stress better',
  'Develop leadership skills',
  'Be more receptive to feedback',
  'Enhance problem-solving approach'
];

// Generate random performance goals
const generateGoals = (employeeId: string, reviewDate: Date): PerformanceGoal[] => {
  const goals: PerformanceGoal[] = [];
  const goalCount = Math.floor(Math.random() * 3) + 2; // 2-4 goals
  
  const categories: ('development' | 'business' | 'personal')[] = ['development', 'business', 'personal'];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  
  const goalOptions = {
    development: [
      'Complete advanced React training',
      'Learn new database technologies',
      'Improve public speaking skills',
      'Get certified in project management',
      'Develop leadership capabilities'
    ],
    business: [
      'Increase customer satisfaction score',
      'Reduce project delivery time',
      'Implement process improvements',
      'Enhance team collaboration',
      'Improve code quality metrics'
    ],
    personal: [
      'Improve work-life balance',
      'Develop better time management habits',
      'Practice active listening',
      'Enhance written communication',
      'Learn effective delegation'
    ]
  };
  
  const descriptionOptions = {
    development: [
      'Complete online courses and apply learned concepts in projects',
      'Attend workshops and share knowledge with team members',
      'Practice regularly and seek feedback from mentors',
      'Study materials and pass the certification exam',
      'Lead small team initiatives and projects'
    ],
    business: [
      'Implement customer feedback system and address issues promptly',
      'Analyze current workflow and implement efficiency improvements',
      'Identify bottlenecks and introduce automated solutions',
      'Organize team building activities and collaborative sessions',
      'Establish code review process and quality standards'
    ],
    personal: [
      'Establish clear boundaries between work and personal time',
      'Use time management techniques like Pomodoro and track progress',
      'Practice focused attention during meetings and conversations',
      'Take writing courses and apply techniques in communications',
      'Start assigning appropriate tasks to team members'
    ]
  };
  
  for (let i = 0; i < goalCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const titleOptions = goalOptions[category];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    
    const descOptions = descriptionOptions[category];
    const description = descOptions[Math.floor(Math.random() * descOptions.length)];
    
    // Set start date to review date
    const startDate = format(reviewDate, 'yyyy-MM-dd');
    
    // Set target date to 3-6 months from start
    const targetMonths = Math.floor(Math.random() * 4) + 3; // 3-6 months
    const targetDate = format(new Date(reviewDate.getFullYear(), reviewDate.getMonth() + targetMonths, reviewDate.getDate()), 'yyyy-MM-dd');
    
    // Randomize status and progress
    const statuses: ('not-started' | 'in-progress' | 'completed' | 'deferred')[] = ['not-started', 'in-progress', 'completed', 'deferred'];
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    let progress = 0;
    let completionDate: string | undefined;
    
    if (status === 'not-started') {
      progress = 0;
    } else if (status === 'in-progress') {
      progress = Math.floor(Math.random() * 70) + 10; // 10-79%
    } else if (status === 'completed') {
      progress = 100;
      // Completion date between start and now
      const today = new Date();
      const startDateObj = new Date(startDate);
      const daysBetween = Math.floor((today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
      const randomDays = Math.floor(Math.random() * daysBetween);
      const completionDateObj = new Date(startDateObj);
      completionDateObj.setDate(startDateObj.getDate() + randomDays);
      completionDate = format(completionDateObj, 'yyyy-MM-dd');
    } else if (status === 'deferred') {
      progress = Math.floor(Math.random() * 50); // 0-49%
    }
    
    goals.push({
      id: `GOAL-${employeeId}-${i + 1}`,
      title,
      description,
      startDate,
      targetDate,
      completionDate,
      status,
      progress,
      category,
      priority,
      comments: status === 'completed' 
        ? 'Goal completed successfully' 
        : status === 'deferred' 
          ? 'Goal deferred due to changing priorities' 
          : ''
    });
  }
  
  return goals;
};

// Generate random performance reviews
const generatePerformanceReviews = (): PerformanceReview[] => {
  const reviews: PerformanceReview[] = [];
  const today = new Date();
  
  // Generate reviews for the past 2 years, quarterly
  for (let i = 0; i < 8; i++) {
    const reviewDate = subMonths(today, i * 3);
    const year = reviewDate.getFullYear();
    const quarter = Math.floor(reviewDate.getMonth() / 3) + 1;
    const reviewPeriod = `Q${quarter} ${year}`;
    
    // For each employee
    employeesData.forEach(employee => {
      // Skip if employee is inactive
      if (employee.status === 'inactive') return;
      
      // Skip if employee joined after this review period
      const joinDate = new Date(employee.joiningDate);
      if (joinDate > reviewDate) return;
      
      // Random reviewer (assuming HR Manager or a Tech Lead)
      const reviewerId = Math.random() < 0.5 ? 'EMP006' : 'EMP007';
      const reviewerName = reviewerId === 'EMP006' ? 'Sophia Martinez' : 'James Taylor';
      
      // Random overall rating (1-5, with decimal precision)
      const overallRating = Math.round((Math.random() * 3 + 2) * 10) / 10; // 2.0-5.0
      
      // Generate sections with ratings
      const sections = reviewSections.map(section => {
        // Random rating for this section (1-5, with decimal precision)
        const rating = Math.round((Math.random() * 3 + 2) * 10) / 10; // 2.0-5.0
        
        // Generate random comment based on rating
        let comment = '';
        if (rating >= 4.5) {
          comment = 'Exceptional performance in this area. Exceeds all expectations.';
        } else if (rating >= 4.0) {
          comment = 'Excellent performance. Consistently exceeds expectations.';
        } else if (rating >= 3.5) {
          comment = 'Very good performance. Often exceeds expectations.';
        } else if (rating >= 3.0) {
          comment = 'Good performance. Meets all expectations.';
        } else if (rating >= 2.5) {
          comment = 'Satisfactory performance. Meets most expectations.';
        } else {
          comment = 'Needs improvement. Below expectations in some aspects.';
        }
        
        return {
          name: section.name,
          description: section.description,
          rating,
          comments: comment
        };
      });
      
      // Generate random strengths (3-5)
      const strengthCount = Math.floor(Math.random() * 3) + 3;
      const strengths: string[] = [];
      for (let j = 0; j < strengthCount; j++) {
        let strength;
        do {
          strength = strengthOptions[Math.floor(Math.random() * strengthOptions.length)];
        } while (strengths.includes(strength));
        strengths.push(strength);
      }
      
      // Generate random improvements (2-3)
      const improvementCount = Math.floor(Math.random() * 2) + 2;
      const improvements: string[] = [];
      for (let j = 0; j < improvementCount; j++) {
        let improvement;
        do {
          improvement = improvementOptions[Math.floor(Math.random() * improvementOptions.length)];
        } while (improvements.includes(improvement));
        improvements.push(improvement);
      }
      
      // Generate overall comments
      const comments = overallRating >= 4.0
        ? `${employee.firstName} has performed exceptionally well this quarter. Keep up the excellent work!`
        : overallRating >= 3.0
          ? `${employee.firstName} has met expectations and shown good progress this quarter.`
          : `${employee.firstName} has shown improvement but needs to focus on development areas.`;
      
      // Generate random status
      let status: 'draft' | 'submitted' | 'acknowledged' | 'finalized';
      let acknowledgement: { date: string; comments: string } | undefined;
      
      // If review is for a past quarter
      if (i > 0) {
        if (Math.random() < 0.9) { // 90% chance
          status = 'finalized';
          
          // Acknowledgement date is a few days after review date
          const ackDate = new Date(reviewDate);
          ackDate.setDate(ackDate.getDate() + Math.floor(Math.random() * 5) + 1);
          
          acknowledgement = {
            date: format(ackDate, 'yyyy-MM-dd'),
            comments: Math.random() < 0.7
              ? 'I acknowledge this review and appreciate the feedback.'
              : 'Thank you for the feedback. I will work on the improvement areas.'
          };
        } else {
          status = Math.random() < 0.5 ? 'submitted' : 'acknowledged';
        }
      } else {
        // Current quarter
        status = Math.random() < 0.5 ? 'draft' : 'submitted';
      }
      
      // Generate random goals
      const goals = generateGoals(employee.id, reviewDate);
      
      reviews.push({
        id: `REV-${employee.id}-${year}Q${quarter}`,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        reviewerId,
        reviewerName,
        reviewCycle: 'quarterly',
        reviewPeriod,
        reviewDate: format(reviewDate, 'yyyy-MM-dd'),
        status,
        overallRating,
        sections,
        goals,
        strengths,
        improvements,
        comments,
        acknowledgement
      });
    });
  }
  
  return reviews;
};

// Generate all performance data
export const performanceReviews = generatePerformanceReviews();

// Helper functions

// Get performance reviews for a specific employee
export const getEmployeePerformanceReviews = (employeeId: string): PerformanceReview[] => {
  return performanceReviews.filter(review => review.employeeId === employeeId);
};

// Get performance reviews for a specific period
export const getPerformanceReviewsByPeriod = (period: string): PerformanceReview[] => {
  return performanceReviews.filter(review => review.reviewPeriod === period);
};

// Get average rating for a specific employee
export const getEmployeeAverageRating = (employeeId: string): number => {
  const reviews = getEmployeePerformanceReviews(employeeId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((total, review) => total + review.overallRating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

// Export the performance data
export default performanceReviews;