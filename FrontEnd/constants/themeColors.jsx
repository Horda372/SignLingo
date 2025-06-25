// constants/themeColors.js
export const lightModeColors = {
  // Screen background
  background: '#FFFBEB',
   auth: {
    headerGradient:    ['#A35E3C', '#7C4A26'], // warm terracotta → sienna
    formGradient:      ['#FFF4E5', '#FFE8CC'], // very pale cream
    inputBg:           '#FFFFFF',
    inputBorder:       '#E0B08A',             // soft gold
    placeholder:       '#C2926A',             // muted tan
    primaryGradient:   ['#C46210', '#D97706'],// burnt orange → amber
    secondaryGradient: ['#FDE047', '#D97706'],// lemon → amber for “Or continue”
    switchLink:        '#92400E',             // your existing brown
    text:              '#4B2E2A',             // dark chocolate
  },
  // Chapter header gradient
  chapterHeaderGradient: ['#92400E', '#EA580C'],
  
  // Connecting line
  connectingLine: '#D97706',
  
  // Buttons
  buttonBg: '#FEF3C7',
  buttonBgPressed: '#FDE68A',
  
  // Lesson-circle gradients
  lessonCircle: {
    completed: ['#D97706', '#92400E'],
    current:   ['#EA580C', '#C2410C'],
    locked:    ['#9CA3AF', '#6B7280'],
  },
  
  // Lesson-label gradients
  lessonLabel: {
    completed: ['#FEF3C7', '#FDE68A'],
    current:   ['#FED7AA', '#FDBA74'],
    locked:    ['#F3F4F6', '#E5E7EB'],
  },
  
  // Status icons
  statsIcons: {
    star:    '#D97706',
    diamond: '#60A5FA',
    trophy:  '#F59E0B',
  },
  
  // Chapter-completion & encouragement cards
  cardGradient: ['#FEF3C7', '#FDE68A'],
  cardBorder:   '#D97706',
  
  // Reset button
  resetButton: '#DC2626',
  
  // Daily-progress bar
  dailyProgress: {
    track: '#FDE68A',
    fill:  '#D97706',
  },
  
  // Lesson number badge
  numberBadge: '#92400E',
  categoryText: '#FFFFFF',
  
  // Primary text colors
  text: '#92400E',             // main headings and body
  textLight: '#FFFFFF',        // on dark gradients
  textSecondary: '#D97706',    // subtext, previews
  
  // Categories
  categories: {
    'Practice Tips': ['#D97706', '#92400E'],
    'Q&A':           ['#EA580C', '#C2410C'],
    'Events':        ['#F59E0B', '#D97706'],
    'Stories':       ['#92400E', '#78350F'],
    'Resources':     ['#C2410C', '#92400E'],
    'General':       ['#EA580C', '#D97706'],
  },
};

export const darkModeColors = {
  // Screen background
  background: '#2C1F3A',

  // Chapter header gradient
  chapterHeaderGradient: ['#5C3E36', '#382E2A'],  // instead of ['#FFFFFF','#FFFFFF']

  // Connecting line
  connectingLine: '#CD853F',
  auth: {
    headerGradient:    ['#5C3E36', '#382E2A'], // deep brown tones
    formGradient:      ['#3E2A28', '#2C1F1A'], // charcoal‐brown
    inputBg:           '#2E2624',             // near‐black
    inputBorder:       '#5C3E36',             // matching brown
    placeholder:       '#7E6B65',             // dusty taupe
    primaryGradient:   ['#8C6A5E', '#704E44'],// muted brown/orange
    secondaryGradient: ['#FCD34D', '#A37058'],// golden → amber
    switchLink:        '#A37058',             // amber accent
    text:              '#EDEDED',             // near‐white
  },
  // Buttons
  buttonBg: '#4B4450',
  buttonBgPressed: '#6D4C41',

  // Lesson-circle gradients
lessonCircle: {
  completed: ['#6D6761', '#5A554F'],  // top lighter, bottom darker
  current:   ['#554F4A', '#494543'],
  locked:    ['#292724', '#1D1B1A'],
},
placeholder:"FFFFFF",
lessonLabel: {
  completed: ['#7E7973', '#6D6761'],
  current:   ['#615E5B', '#55514E'],
  locked:    ['#383634', '#2C2A28'],
},



  // Status icons
  statsIcons: {
    star:    '#FDE047',
    diamond: '#60A5FA',
    trophy:  '#F59E0B',
  },

  // Chapter-completion & encouragement cards
  cardGradient: ['#1B0C2B', '#2C1F3A'],
  cardBorder:   '#432C2C',

  // Reset button
  resetButton: '#B91C1C',

  // Daily-progress bar
  dailyProgress: {
    track: '#4B4450',
    fill:  '#CD853F',
  },

  // Lesson number badge
  numberBadge: '#CD853F',
  categoryText: '#FFFFFF',

  // Primary text colors
  text: '#EDEDED',
  textLight: '#FFFFFF',
  textSecondary: '#CD853F',

  // Categories (dark-mode jewel tones)
  categories: {
    'Practice Tips': ['#3E2C3D', '#4E3D50'],
    'Q&A':           ['#2E293F', '#403A5F'],
    'Events':        ['#3F2940', '#50315A'],
    'Stories':       ['#36293A', '#4A3C52'],
    'Resources':     ['#2E3C3A', '#3D4C49'],
    'General':       ['#2C2C3A', '#3F3F52'],
  },
};
