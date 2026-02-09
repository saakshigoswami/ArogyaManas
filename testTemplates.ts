
export interface TestTemplate {
  id: 'PHQ-9' | 'GAD-7';
  name: string;
  description: string;
  questions: string[];
  scale: string[];
  getSeverity: (score: number) => string;
}

export const TEST_TEMPLATES: Record<string, TestTemplate> = {
  'PHQ-9': {
    id: 'PHQ-9',
    name: 'Patient Health Questionnaire-9',
    description: 'A multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading the newspaper or watching television',
      'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
      'Thoughts that you would be better off dead or of hurting yourself in some way'
    ],
    scale: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    getSeverity: (score: number) => {
      if (score <= 4) return 'Minimal Depression';
      if (score <= 9) return 'Mild Depression';
      if (score <= 14) return 'Moderate Depression';
      if (score <= 19) return 'Moderately Severe Depression';
      return 'Severe Depression';
    }
  },
  'GAD-7': {
    id: 'GAD-7',
    name: 'Generalized Anxiety Disorder-7',
    description: 'A brief measure for assessing generalized anxiety disorder.',
    questions: [
      'Feeling nervous, anxious or on the edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen'
    ],
    scale: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    getSeverity: (score: number) => {
      if (score <= 4) return 'Minimal Anxiety';
      if (score <= 9) return 'Mild Anxiety';
      if (score <= 14) return 'Moderate Anxiety';
      return 'Severe Anxiety';
    }
  }
};
