import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Lightbulb,
  RotateCcw,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ContentType, PostLength } from '@/lib/types';
import { SAMPLE_IDEAS, SampleIdea } from '@/lib/samplePosts';

interface WizardTabProps {
  onGenerate: (data: {
    contentType: ContentType;
    postLength: PostLength;
    researchFindings?: string;
    wizardAnswers: {
      dilemma: string;
      personalBackground: string;
      prosAndCons: string;
      concreteExample: string;
      personalStance: string;
    };
  }) => void;
  apiKey?: string;
  isLoading: boolean;
}

export const WizardTab: React.FC<WizardTabProps> = ({ onGenerate, apiKey, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [postLength, setPostLength] = useState<PostLength>('medium');

  // Web Research in Wizard
  const [isResearching, setIsResearching] = useState(false);
  const [researchFindings, setResearchFindings] = useState<string>('');
  const [showResearchBox, setShowResearchBox] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  const [answers, setAnswers] = useState({
    dilemma: '',
    personalBackground: '',
    prosAndCons: '',
    concreteExample: '',
    personalStance: '',
  });

  const handleConductResearch = async () => {
    const query = answers.dilemma.trim();
    if (!query) return;

    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: query,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || '╫й╫Т╫Щ╫Р╫Ф ╫С╫С╫Щ╫ж╫Х╫в ╫Ю╫Ч╫з╫и ╫Ф╫и╫й╫к');
      }

      setResearchFindings(data.findings || '');
      setShowResearchBox(true);
    } catch (err: any) {
      setResearchError(err.message || '╫й╫Т╫Щ╫Р╫Ф ╫С╫С╫Щ╫ж╫Х╫в ╫Ф╫Ю╫Ч╫з╫и');
    } finally {
      setIsResearching(false);
    }
  };

  const steps = [
    {
      step: 1,
      title: '╫Ц╫Щ╫Ф╫Х╫Щ ╫Ф╫У╫Щ╫Ь╫Ю╫Ф ╫Х╫Ф╫Ю╫к╫Ч ╫Ф╫Ю╫и╫Ы╫Ц╫Щ',
      subtitle: '╫Ф╫Ю╫ж╫С ╫й╫Ь "╫С╫Щ╫Я ╫Ф╫д╫Ш╫Щ╫й ╫Ь╫б╫У╫Я"',
      question: '╫Ю╫Ф╫Щ ╫Ф╫У╫Щ╫Ь╫Ю╫Ф ╫Ф╫а╫Щ╫Ф╫Х╫Ь╫Щ╫к ╫Р╫Х ╫Ф╫Ю╫з╫ж╫Х╫в╫Щ╫к ╫й╫в╫Ь╫Щ╫Ф ╫Р╫а╫Ч╫а╫Х ╫и╫Х╫ж╫Щ╫Э ╫Ь╫Ы╫к╫Х╫С ╫Ф╫д╫в╫Э? ╫Ю╫Ф╫Э ╫й╫а╫Щ ╫Ф╫Ы╫Х╫Ч╫Х╫к, ╫Ф╫в╫и╫Ы╫Щ╫Э ╫Р╫Х ╫Ф╫Р╫Щ╫а╫Ш╫и╫б╫Щ╫Э ╫й╫Ю╫к╫а╫Т╫й╫Щ╫Э ╫Ы╫Р╫Я?',
      placeholder: '╫Ь╫Ю╫й╫Ь: ╫Ф╫Ю╫к╫Ч ╫й╫С╫Щ╫Я ╫Ф╫ж╫Х╫и╫Ъ ╫й╫Ь ╫Ф╫Р╫и╫Т╫Х╫Я ╫С╫Т╫Ю╫Щ╫й╫Х╫к ╫к╫д╫в╫Х╫Ь╫Щ╫к ╫Ь╫С╫Щ╫Я ╫Ф╫ж╫Х╫и╫Ъ ╫й╫Ь ╫Ф╫в╫Х╫С╫У ╫С╫С╫Щ╫Ш╫Ч╫Х╫Я ╫к╫в╫б╫Х╫з╫к╫Щ ╫Х╫Щ╫ж╫Щ╫С╫Х╫к...',
      field: 'dilemma' as const,
      tip: '╫С╫У╫Х╫з ╫й╫Р╫Щ╫Я ╫Ы╫Р╫Я ╫и╫з "╫ж╫У ╫ж╫Х╫У╫з ╫Х╫ж╫У ╫Ш╫Х╫в╫Ф", ╫Р╫Ь╫Р ╫й╫а╫Щ ╫Ы╫Х╫Ч╫Х╫к ╫Ь╫Т╫Щ╫Ш╫Щ╫Ю╫Щ╫Щ╫Э ╫й╫Ю╫Х╫й╫Ы╫Щ╫Э ╫Ь╫Ы╫Щ╫Х╫Х╫а╫Щ╫Э ╫Ю╫а╫Х╫Т╫У╫Щ╫Э.',
    },
    {
      step: 2,
      title: '╫а╫Щ╫б╫Щ╫Х╫Я ╫Р╫Щ╫й╫Щ ╫Х╫и╫з╫в ╫Ф╫Щ╫б╫Ш╫Х╫и╫Щ',
      subtitle: '╫д╫и╫б╫д╫з╫Ш╫Щ╫С╫Ф ╫й╫Ь "╫С╫в╫С╫и... ╫Ы╫Щ╫Х╫Э..."',
      question: '╫Р╫Щ╫Ц╫Ф ╫и╫з╫в ╫Ю╫Ф╫а╫Щ╫б╫Щ╫Х╫Я ╫Ф╫Р╫Щ╫й╫Щ ╫й╫Ь╫Ъ ╫С╫й╫Ш╫Ч (╫Ю╫Ь╫Х╫а╫Р╫Х╫к, ╫а╫Щ╫Ф╫Х╫Ь ╫Ю╫й"╫Р) ╫Ю╫к╫Ч╫С╫и ╫Ь╫а╫Х╫й╫Р? ╫Р╫Щ╫Ъ ╫Ф╫У╫С╫и╫Щ╫Э ╫а╫и╫Р╫Х ╫С╫в╫С╫и ╫Ь╫в╫Х╫Ю╫к ╫Ф╫Ю╫ж╫Щ╫Р╫Х╫к ╫Ы╫Щ╫Х╫Э?',
      placeholder: '╫Ь╫Ю╫й╫Ь: ╫С╫к╫Ч╫Щ╫Ь╫к ╫й╫а╫Х╫к ╫Ф-90 ╫С╫Ю╫Ь╫Х╫а╫Х╫к ╫С╫Р╫Щ╫Ь╫к ╫Ь╫Р ╫Ф╫Ы╫и╫а╫Х ╫Ы╫Ю╫в╫Ш ╫в╫Х╫С╫У╫Щ ╫з╫С╫Ь╫Я... ╫Ы╫Щ╫Х╫Э ╫Ы╫Ю╫в╫Ш ╫С╫Ь╫к╫Щ ╫Р╫д╫й╫и╫Щ ╫Ь╫Ф╫д╫в╫Щ╫Ь ╫Ю╫Ь╫Х╫Я ╫С╫Ь╫в╫У╫Щ╫Ф╫Э...',
      field: 'personalBackground' as const,
      tip: '╫Ф╫в╫Щ╫Т╫Х╫Я ╫С╫б╫Щ╫д╫Х╫и ╫Р╫Щ╫й╫Щ ╫Р╫Х ╫С╫а╫Щ╫Т╫Х╫У ╫Ф╫Щ╫б╫Ш╫Х╫и╫Щ ╫Ю╫в╫а╫Щ╫з ╫Р╫Х╫к╫а╫Ш╫Щ╫Х╫к, ╫б╫Ю╫Ы╫Х╫к ╫Х╫в╫Х╫Ю╫з ╫Ь╫Ы╫Ь ╫Ф╫а╫Щ╫к╫Х╫Ч.',
    },
    {
      step: 3,
      title: '╫Ш╫Щ╫в╫Х╫а╫Щ ╫Ф╫С╫в╫У ╫Х╫Ф╫а╫Т╫У',
      subtitle: '╫д╫и╫Щ╫б╫к ╫Ф╫Ю╫Х╫и╫Ы╫С╫Х╫к ("╫Ю╫Ч╫У... ╫Ю╫Р╫Щ╫У╫Ъ")',
      question: '╫Ю╫Ф╫Э ╫Ф╫Ш╫Щ╫в╫Х╫а╫Щ╫Э ╫Ф╫Ю╫и╫Ы╫Ц╫Щ╫Щ╫Э ╫й╫Ь ╫Ы╫Ь ╫ж╫У ╫С╫У╫Щ╫Ь╫Ю╫Ф? ╫Ь╫Ю╫Ф ╫ж╫У ╫Р\' ╫ж╫Х╫У╫з, ╫Х╫Ю╫Р╫Щ╫У╫Ъ тАФ ╫Ю╫Ф╫Э ╫Ф╫й╫Щ╫з╫Х╫Ь╫Щ╫Э ╫Ф╫Ь╫Т╫Щ╫Ш╫Щ╫Ю╫Щ╫Щ╫Э ╫й╫Ь ╫ж╫У ╫С\'?',
      placeholder: '╫Ю╫Ч╫У: ...\n╫Ю╫Р╫Щ╫У╫Ъ: ...\n╫й╫Щ╫з╫Х╫Ь╫Щ ╫в╫Ь╫Х╫к ╫Ю╫Х╫Ь ╫й╫Щ╫и╫Х╫к, ╫Ф╫Х╫Т╫а╫Х╫к ╫Ю╫Х╫Ь ╫Ю╫Ф╫Щ╫и╫Х╫к...',
      field: 'prosAndCons' as const,
      tip: '╫Ф╫ж╫Т╫к ╫й╫а╫Щ ╫Ф╫ж╫У╫У╫Щ╫Э ╫Ь╫д╫а╫Щ ╫Ф╫С╫в╫к ╫У╫в╫Ф ╫С╫Х╫а╫Ф ╫Р╫Ю╫Х╫Я ╫Х╫Ю╫и╫Р╫Ф ╫Ь╫з╫Х╫и╫Р ╫й╫Ф╫У╫Щ╫Ь╫Ю╫Ф ╫а╫й╫з╫Ь╫Ф ╫С╫Ы╫Х╫С╫У ╫и╫Р╫й ╫Р╫Ю╫Щ╫к╫Щ.',
    },
    {
      step: 4,
      title: '╫У╫Х╫Т╫Ю╫Ф ╫Ю╫Х╫Ч╫й╫Щ╫к / ╫к╫б╫и╫Щ╫Ш ╫Ю╫Ф╫й╫Ш╫Ч',
      subtitle: '"╫У╫Ю╫Щ╫Щ╫а╫Х ╫Ь╫в╫ж╫Ю╫Ы╫Э ╫Ю╫з╫и╫Ф ╫й╫С╫Х..."',
      question: '╫Ф╫Р╫Э ╫Щ╫й ╫б╫ж╫а╫Ф ╫з╫Х╫а╫з╫и╫Ш╫Щ╫к, ╫Ю╫з╫и╫Ф ╫Ю╫С╫Ч╫Я ╫Р╫Х ╫к╫и╫Ч╫Щ╫й ╫Щ╫Х╫Ю╫Щ╫Х╫Ю╫Щ ╫й╫Р╫д╫й╫и ╫Ь╫Ф╫ж╫Щ╫Т ╫Ь╫з╫Х╫и╫Р ╫Ы╫У╫Щ ╫Ь╫Ф╫Ю╫Ч╫Щ╫й ╫Р╫к ╫Ф╫С╫в╫Щ╫Ф ╫С╫Р╫Х╫д╫Я ╫Ч╫Щ?',
      placeholder: '╫Ь╫Ю╫й╫Ь: ╫У╫Ю╫Щ╫Щ╫а╫Х ╫Ь╫в╫ж╫Ю╫Ы╫Э ╫Ю╫з╫и╫Ф ╫С╫Х ╫Ю╫а╫Ф╫Ь ╫Ю╫Ч╫Ь╫з╫Ф ╫ж╫в╫Щ╫и ╫Ю╫з╫С╫Ь ╫к╫Х╫ж╫Р╫Х╫к ╫Ю╫С╫Ч╫Я ╫Ю╫Ф╫Щ╫Ю╫а╫Х╫к ╫Х╫Ю╫Ш╫Щ╫Ч ╫Р╫Х╫к╫Я ╫С╫в╫Х╫С╫У ╫С╫и╫Т╫в ╫й╫Ь ╫Ы╫в╫б...',
      field: 'concreteExample' as const,
      tip: '╫У╫Х╫Т╫Ю╫Ф ╫Ю╫Х╫Ч╫й╫Щ╫к ╫Р╫Ч╫к ╫й╫Х╫Х╫Ф ╫Щ╫Х╫к╫и ╫Ю╫в╫й╫и ╫д╫б╫з╫Р╫Х╫к ╫й╫Ь ╫а╫Щ╫к╫Х╫Ч ╫Ю╫Х╫д╫й╫Ш.',
      },
    {
      step: 5,
      title: '╫Ф╫в╫ж╫У╫Ф ╫Ф╫Р╫Щ╫й╫Щ╫к ╫Х╫Ф╫Юк╫Х╫С╫а╫Ф ╫Ф╫а╫Щ╫Ф╫Х╫Ь╫Щ╫к',
      subtitle: '"╫Ь╫к╫д╫Щ╫й╫к╫Щ..." ╫Х╫Ю╫б╫и ╫Ю╫б╫Щ╫Щ╫Э',
      question: '╫Ю╫Ф╫Щ ╫Ф╫в╫Ю╫У╫Ф ╫Ф╫Р╫Щ╫й╫Щ╫к ╫й╫Ь╫Ъ ("╫Ь╫к╫д╫Щ╫й╫к╫Щ" / "╫Ь╫У╫в╫к╫Щ") ╫Ь╫Т╫С╫Щ ╫У╫и╫Ъ ╫Ф╫Ф╫к╫Ю╫Х╫У╫У╫Х╫к ╫Ф╫а╫Ы╫Х╫а╫Ф, ╫Х╫Ю╫Ф╫Х ╫Ф╫Ю╫б╫и ╫Ф╫Ю╫Р╫Ц╫Я ╫Х╫Ф╫Ю╫в╫Х╫У╫У ╫Ь╫з╫Х╫и╫Р ╫С╫б╫Щ╫Х╫Э?',
      placeholder: '╫Ь╫У╫в╫к╫Щ, ╫Р╫Щ╫Я ╫Ы╫Р╫Я ╫д╫к╫и╫Х╫Я ╫з╫б╫Э ╫Р╫Ч╫У ╫Р╫Ь╫Р ╫ж╫Х╫и╫Ъ ╫С╫Ю╫в╫а╫Ф ╫Ю╫в╫и╫Ы╫к╫Щ ╫Ю╫к╫Ю╫й╫Ъ... ╫Р╫Ц ╫С╫Х╫Р╫Х ╫а╫Щ╫к╫Я ╫Ь╫Ю╫Ф╫Ь╫Ъ ╫ж\'╫Р╫а╫б ╫Х╫С╫Ф╫ж╫Ь╫Ч╫Ф!',
      field: 'personalStance' as const,
      tip: '╫Ц╫Ы╫Х╫и: ╫в╫Ю╫У╫Ф ╫Ц╫Ф╫Щ╫и╫Ф ╫й╫Р╫Щ╫а╫Ф ╫Ю╫а╫Щ╫д╫б╫Ш, ╫Ю╫а╫Х╫б╫Ч╫к ╫Ы╫У╫в╫Ф ╫Р╫Щ╫й╫Щ╫к ("╫Ь╫к╫д╫Щ╫й╫к╫Щ"), ╫Х╫Ю╫б╫к╫Щ╫Щ╫Ю╫к ╫С╫в╫Щ╫У╫Х╫У ("╫С╫Ф╫ж╫Ь╫Ч╫Ф!").',
    },
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onGenerate({
      contentType,
      postLength,
      researchFindings: researchFindings.trim() ? researchFindings : undefined,
      wizardAnswers: answers,
    });
  };

  const handleLoadSample = (sample: SampleIdea) => {
    if (sample.id === 'foreign-workers') {
      setAnswers({
        dilemma: '╫Ф╫в╫б╫з╫к ╫в╫Х╫С╫У╫Щ╫Э ╫Ц╫и╫Щ╫Э ╫Х╫Щ╫и╫У╫а╫Щ╫Э ╫Ь╫в╫С╫Х╫У╫Х╫к ╫Ю╫й╫з ╫Х╫а╫Щ╫з╫Щ╫Х╫Я ╫С╫Ю╫Ь╫Х╫а╫Х╫к ╫Ю╫Х╫Ь ╫Ф╫и╫ж╫Х╫Я ╫Ь╫Ф╫в╫б╫Щ╫з ╫Щ╫й╫и╫Р╫Ь╫Щ╫Э ╫Х╫Ч╫й╫й╫Х╫к ╫С╫Щ╫Ш╫Ч╫Х╫а╫Щ╫Щ╫Э ╫Х╫к╫и╫С╫Х╫к╫Щ╫Щ╫Э.',
        personalBackground: '╫Ю╫в╫Ь 20 ╫й╫а╫Х╫к ╫а╫Щ╫Ф╫Х╫Ь ╫Ю╫й╫Р╫С╫Щ ╫Р╫а╫Х╫й ╫С╫Ю╫Ь╫Х╫а╫Х╫к ╫С╫Р╫Щ╫Ь╫к тАФ ╫и╫Р╫Щ╫к╫Щ ╫Р╫Щ╫Ъ ╫Ю╫в╫а╫з╫Щ╫Э ╫Ю╫Ю╫й╫Ь╫к╫Щ╫Щ╫Э ╫Ь╫Р ╫Ф╫ж╫Ь╫Щ╫Ч╫Х ╫Ь╫Ф╫С╫Щ╫Р ╫Щ╫й╫и╫Р╫Ь╫Щ╫Э ╫Ь╫Ю╫з╫ж╫Х╫в╫Х╫к ╫Ф╫а╫Щ╫з╫Щ╫Х╫Я ╫Ь╫Р╫Х╫и╫Ъ ╫й╫а╫Щ╫Э.',
        prosAndCons: '╫Ю╫Ч╫У: ╫Ю╫в╫а╫Ф ╫Ю╫Щ╫Щ╫У╫Щ ╫Х╫Ю╫ж╫Щ╫Ь ╫Ь╫Ю╫Ч╫б╫Х╫и ╫Ф╫з╫и╫Щ╫Ш╫Щ ╫С╫Щ╫У╫Щ╫Щ╫Э ╫в╫Х╫С╫У╫Х╫к, ╫и╫Ю╫к ╫к╫Ч╫Ц╫Х╫з╫Ф ╫Ш╫Х╫С╫Ф. ╫Ю╫Р╫Щ╫У╫Ъ: ╫Ч╫й╫й╫Х╫к ╫С╫Щ╫Ш╫Ч╫Х╫а╫Щ╫Щ╫Э, ╫Ю╫Ч╫б╫Х╫Э ╫й╫д╫Ф ╫Ю╫Х╫Ь ╫Ф╫Р╫Х╫и╫Ч, ╫к╫Ь╫Х╫к ╫С╫Ю╫У╫Щ╫а╫Щ╫Х╫к ╫Ю╫Ю╫й╫Ь╫к╫Щ╫Щ╫вю',
        concreteExample: '┘=yэyЭyЭzyRyэzyMy┬yэzЭzrzЭz-y]yэy2yэy]y┬y}y=zНyЭy╥y═yyэzy]z}yЭy╥yzЭz-yBCгy╜zЭyMy═y]yyТyэy═yyy]zНy}yЭy╥ymy]z-yэyЭy╥┬y]yy═yТz-y]yy=yЭy╥ymzНyЭy╥yyЭyЄyэyТzЭyЭzz}yBтr└вW'6Ўц┼7Fц6Sв}y═zнzMyЭzЭzнyТ┬ymyRy═yzMzЭzНyByyЭy=yЭyy═yЭzвyy═yyэz-zyByЭzЭyЭy╥y]yMy╜zНy}yТтyЭzТy═zyMy┬ymyzвyy╜yy]y2┬yyэz}zmy]z-yЭy]zвy]yzy]yy═zy]zвтyyMzmy═y}yBr└в╥У░в╥V╟6R░в6WDч7vW'2З░вFЦ╞V╓╓в6╫╞RчFЧF╞R└вW'6Ўц─&6╢w&ўVцCв}zyЭzyЭy]yЄzЭyНyrzНy▌zЭzyЭy╥yz-zz2yMzyЭyMy]y┬y]yMyэy═y]zyy]zвтr└в&ў4цD6Ўч3в6╫╞Rч&t6ЎчFVчB└в6Ўц7&WFTWЖ╫╞Sв}y=yэyЭyЭzyRyэz}zНyBzЭyyRyэzyMy┬z-y]yэy2yэy]y┬yMy}y═yНyBz}zЭyBтттr└вW'6Ўц┼7Fц6Sв}y═zнzMyЭzЭzнyТ┬yЭzТy═yэzmy]yyzвyMyyЭymy]yЄyMzy╜y]yЄyyЭyЄyMzmzНy╜yЭy╥yMzЭy]zyЭy╥тyyMzmy═y}yBr└в╥У░в╨в╙░ав6Ўч7B╞VцwFДўFЦЎч3в▓ЦCвў7D╞VцwFГ▓╞&V├в7G&Ццs▓&цvSв7G&Ццr╒╡╥╥░в▓ЦCвw6Жў'Br┬╞&V├в}z}zmzВr┬&цvSвs3╙CSyэyЭy═yЭy╥r╥└в▓ЦCвv╓VFЧV╥r┬╞&V├в}yyЭzy]zyТr┬&цvSвsc╙ГSyэyЭy═yЭy╥r╥└в▓ЦCвv╞Ўцrr┬╞&V├в}yzНy]yвr┬&цvSвs╙SyэyЭy═yЭy╥r╥└в╙░ав&WGW&тАв╞FЧb6╞74ц╓S╥&&r╫vЖЧFRF&│ж&r╓Fц&"╙У&ўVцFVB╙'Ж┬6ЖFўr╫6╥&ў&FW"&ў&FW"╓w&Т╙#F&│ж&ў&FW"╓Fц&"╙Г╙b6╙з╙В#рв в▓ЄвFўЖVFW"вў╨в╞FЧb6╞74ц╓S╥&f╞WВf╞WВ╓6Ў┬6╙жf╞WВ╫&ўr6╙жЧFV╫2╓6VчFW"зW7FЦgТ╓&WGvVVтv╙B"╙b&ў&FW"╓"&ў&FW"╓w&Т╙F&│ж&ў&FW"╓Fц&"╙Г#рв╞FЧcрв╞Г"6╞74ц╓S╥'FWЗB╓╞rfЎчB╓&Ў╞BFWЗB╓w&Т╙УF&│зFWЗB╫vЖЧFRf╞WВЧFV╫2╓6VчFW"v╙"#рв─6Ў╫726╞74ц╓S╥'r╙RВ╙RFWЗB╓Fц&"╙cF&│зFWЗB╓vЎ╞B╙C"єрвyzЭz2zнzЭyy]y┬yэy]zy}yCвzMyЭzнy]yrzНz-yЭy]yЄy╙RzЭy═yyЭy╨в┬ЎГ#рв╟6╞74ц╓S╥'FWЗB╫6╥FWЗB╓w&Т╙SF&│зFWЗB╓w&Т╙C╫B╙#рвyэz-zyBz-y┬RzЭyy═y]zвyэzMzнyryэy}y═zRyzвyMy=yЭy═yэyB┬yMzНz}z"┬yНyЭz-y]zyТyMyz-y2¤zy-y2y]yMy=y]y-yэyByMyэy]y}zЭyЭzвy═zMzyТy╜zнyЭyzвyMzMy]zyВрв┬ўрв┬ЎFЧcрав▓Євў7B╞VцwFВ6V╞V7Fў"b╞ЎB6╫╞Rвў╨в╞FЧb6╞74ц╓S╥&f╞WВf╞WВ╫w&ЧFV╫2╓6VчFW"v╙2#рв╞FЧb6╞74ц╓S╥&f╞WВЧFV╫2╓6VчFW"v╙&r╓w&Т╙SF&│ж&r╓Fц&"╙Г╙&ўVцFVB╫Ж┬&ў&FW"&ў&FW"╓w&Т╙#F&│ж&ў&FW"╓Fц&"╙s#рв╢╞VцwFДўFЦЎч2ц╓ВЖўBТ╙тАв╞'WGFЎрв╢WУ╫╢ўBцЦG╨вGЧS╥&'WGFЎт вЎф6╞Ц6│╫▓ВТ╙т6WEў7D╞VцwFВЖўBцЦBЧ╨в6╞74ц╓S╫╢В╙"уRТ╙&ўVцFVB╓╞rFWЗB╫З2fЎчB╫6V╓Ц&Ў╞BG&ч6ЧFЦЎт╓╞┬G░вў7D╞VцwFВ╙╙╥ўBцЦ@вЄv&r╓Fц&"╙sFWЗB╫vЖЧFR6ЖFўr╫З2pввwFWЗB╓w&Т╙cF&│зFWЗB╓w&Т╙3ЖўfW#зFWЗB╓w&Т╙Уpв╓╨вFЧF╞S╫╢ўBч&цvW╨врв╢ўBц╞&V╟╨в┬Ў'WGFЎурвТЧ╨в┬ЎFЧcрав╞'WGFЎрвGЧS╥&'WGFЎт вЎф6╞Ц6│╫▓ВТ╙тЖцF╞T╞ЎE6╫╞RЕ4╒─UЇФDT5│╥Ч╨в6╞74ц╓S╥'FWЗB╫З2&r╓Fц&"╙SF&│ж&r╓Fц&"╙ГЖўfW#ж&r╓Fц&"╙FWЗB╓Fц&"╙sF&│зFWЗB╓vЎ╞B╙CВ╙2Т╙уR&ўVцFVB╓╞r&ў&FW"&ў&FW"╓Fц&"╙#F&│ж&ў&FW"╓Fц&"╙sfЎчB╓╓VFЧV╥G&ч6ЧFЦЎт╓6Ў╞ў'2f╞WВЧFV╫2╓6VчFW"v╙уR6V╞b╫7F'B6╙з6V╞b╓WFЄ врв─╞ЦvЗF'V╞"6╞74ц╓S╥'r╙2уRВ╙2уRFWЗB╓vЎ╞B╙S"єрвyэy═yy═y=y]y-yэyCвz-y]yy=yЭy╥ymzНyЭy╨в┬Ў'WGFЎурв┬ЎFЧcрв┬ЎFЧcрав▓Єв7FW2&Ўw&W72ЦцFЦ6Fў"вў╨в╞FЧb6╞74ц╓S╥&╫B╙b#рв╞FЧb6╞74ц╓S╥&w&ЦBw&ЦB╓6Ў╟2╙Rv╙"#рв╖7FW2ц╓ВЗ2Т╙т░в6Ўч7BЧ46Ў╫╞WFVB╥7W'&VчE7FWт2ч7FW░в6Ўч7BЧ47W'&VчB╥7W'&VчE7FW╙╙╥2ч7FW░в&WGW&тАв╞'WGFЎрв╢WУ╫╖2ч7FW╨вGЧS╥&'WGFЎт вЎф6╞Ц6│╫▓ВТ╙т6WD7W'&VчE7FWЗ2ч7FWЧ╨в6╞74ц╓S╫╢f╞WВf╞WВ╓6Ў┬ЧFV╫2╓6VчFW"FWЗB╓6VчFW"╙"&ўVцFVB╫Ж┬&ў&FW"G&ч6ЧFЦЎт╓╞┬G░вЧ47W'&Vч@вЄv&ў&FW"╓Fц&"╙cF&│ж&ў&FW"╓vЎ╞B╙S&r╓Fц&"╙SF&│ж&r╓Fц&"╙Г&Ццr╙"&Ццr╓Fц&"╙cє3F&│з&Ццr╓vЎ╞B╙Sє3pввЧ46Ў╫╞WFV@вЄv&ў&FW"╓V╓W&╞B╙3F&│ж&ў&FW"╓V╓W&╞B╙sєS&r╓V╓W&╞B╙SєSF&│ж&r╓V╓W&╞B╙УSє#FWЗB╓V╓W&╞B╙sF&│зFWЗB╓V╓W&╞B╙Cpввv&ў&FW"╓w&Т╙#F&│ж&ў&FW"╓Fц&"╙ГFWЗB╓w&Т╙Cў6ЧGТ╙cpв╓╨врв╞FЧb6╞74ц╓S╥&f╞WВЧFV╫2╓6VчFW"зW7FЦgТ╓6VчFW"r╙bВ╙b&ўVцFVB╓gV╞┬╓"╙FWЗB╫З2fЎчB╓&Ў╞B#рв╢Ч46Ў╫╞WFVBЄАв─6ЖV6┤6Ч&6╞S"6╞74ц╓S╥'r╙RВ╙RFWЗB╓V╓W&╞B╙cF&│зFWЗB╓V╓W&╞B╙C"єрвТвАв╟7т6╞74ц╓S╫╢Ч47W'&VчBЄwFWЗB╓Fц&"╙ГF&│зFWЗB╓vЎ╞B╙CfЎчB╓&Ў╞Brвrw╙рв╖2ч7FW╨в┬ў7урвЧ╨в┬ЎFЧcрв╟7т6╞74ц╓S╥'FWЗB╒│Е╥fЎчB╓╓VFЧV╥ЖЦFFVт╓Cж&╞Ў6▓G'Vц6FR╓В╫r╓gV╞┬#рв╖2чFЧF╞W╨в┬ў7урв┬Ў'WGFЎурвУ░в╥Ч╨в┬ЎFЧcрв┬ЎFЧcрав▓Єв7W'&VчB7FW6&Bвў╨в╞FЧb6╞74ц╓S╥&╫B╙В&r╓w&Т╙SєsF&│ж&r╓Fц&"╙ГєC&ўVцFVB╙'Ж┬&ў&FW"&ў&FW"╓w&Т╙#F&│ж&ў&FW"╓Fц&"╙s╙b#рв в▓Єв7FW&FvRbFЧF╞Rвў╨в╞FЧb6╞74ц╓S╥&╓"╙B#рв╞FЧb6╞74ц╓S╥&f╞WВf╞WВ╓6Ў┬6╙жf╞WВ╫&ўr6╙жЧFV╫2╓6VчFW"зW7FЦgТ╓6VчFW"v╙"╓"╙#рв╞FЧb6╞74ц╓S╥&f╞WВЧFV╫2╓6VчFW"v╙"FWЗB╫З2fЎчB╓&Ў╞BWW&66RG&6╢Ццr╫vЦFW"FWЗB╓Fц&"╙cF&│зFWЗB╓vЎ╞B╙C#рв╟7уэy╫Ь╫С {currentStep} ╫Ю╫к╫Х╫Ъ 5</span>
              <span>тАв</span>
              <span>{currentStepData.subtitle}</span>
            </div>

            {/* Research button for current dilemma */}
            {currentStep === 1 && (
              <button
                type="button"
                onClick={() => handleConductResearch}
                disabled={isResearching || !answers.dilemma.trim()}
                className="text-xs font-bold text-danbar-700 dark:text-gold-400 hover:text-danbar-900 bg-white dark:bg-danbar-900 hover:bg-danbar-50 px-3 py-1 rounded-lg border border-danbar-200 dark:border-danbar-700 transition-all flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                {isResearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-danbar-600 dark:text-gold-400" />
                    <span>╫Ч╫Х╫з╫и ╫С╫и╫й╫к...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-danbar-600 dark:text-gold-400" />
                    <span>╫С╫ж╫в ╫Ю╫Ч╫з╫и ╫в╫ж╫Ю╫Р╫Щ ╫С╫Р╫Щ╫а╫Ш╫и╫а╫Ш</span>
                  </>
                )}
              </button>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {currentStepData.question}
          </h3>
        </div>

        {/* Research Error Alert if any */}
        {researchError && (
          <div className="mb-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex justify-between items-center">
            <span>{researchError}</span>
            <button onClick={() => setResearchError(null)} className="font-bold text-amber-600">╫б╫Т╫Х╫и</button>
          </div>
        )}

        {/* Research Findings in Wizard */}
        {researchFindings && (
          <div className="mb-4 bg-white/80 dark:bg-danbar-900/80 rounded-xl border border-danbar-200 dark:border-danbar-700 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-danbar-800 dark:text-gold-400">
                <Globe className="w-3.5 h-3.5" />
                <span>╫Ю╫Ю╫ж╫Р╫Щ ╫Ю╫Ч╫з╫и ╫Ю╫Ф╫и╫й╫к ╫в╫С╫Х╫и ╫У╫Щ╫Ь╫Ю╫Ф ╫Ц╫Х:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchBox(!showResearchBox)}
                className="text-[11px] text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <span>{showResearchBox ? '╫Ф╫б╫к╫и' : '╫Ф╫ж╫Т ╫Ю╫Ю╫ж╫Р╫Щ╫Э'}</span>
                {showResearchBox ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            {showResearchBox && (
              <textarea
                rows={4}
                value={researchFindings}
                onChange={(e) => setResearchFindings(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-danbar-950 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-danbar-800 rounded-lg text-xs leading-relaxed font-sans outline-none"
              />
            )}
          </div>
        )}

        {/* Input area */}
        <div className="mt-4">
          <textarea
            rows={5}
            value={answers[currentStepData.field]}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [currentStepData.field]: e.target.value,
              })
            }
            placeholder={currentStepData.placeholder}
            className="w-full p-4 bg-white dark:bg-danbar-900 text-gray-900 dark:text-white border border-gray-200 dark:border-danbar-700 rounded-xl focus:ring-2 focus:ring-danbar-500 outline-none text-sm sm:text-base placeholder-gray-400 leading-relaxed font-sans"
          />
        </div>

        {/* Tip */}
        <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-danbar-900/60 p-3 rounded-xl border border-gray-100 dark:border-danbar-800">
          <Lightbulb className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <span>{currentStepData.tip}</span>
        </div>

      </div>

      {/* Navigation & Action Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-danbar-800">
        
        {/* Prev button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-danbar-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-danbar-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>╫й╫Ь╫С ╫з╫Х╫У╫Э</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              setAnswers({ dilemma: '', personalBackground: '', prosAndCons: '', concreteExample: '', personalStance: '' });
              setCurrentStep(1);
            }}
            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="╫Р╫Щ╫д╫Х╫б ╫к╫й╫Х╫С╫Х╫к"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Next / Generate button */}
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => handleNext}
              className="px-6 py-2.5 rounded-xl bg-danbar-800 hover:bg-danbar-900 text-white font-semibold transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <span>╫Ф╫Ю╫й╫Ъ ╫Ь╫й╫Ь╫С ╫Ф╫С╫Р</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !answers.dilemma.trim()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-danbar-700 to-danbar-900 hover:from-danbar-800 hover:to-danbar-950 text-white font-semibold shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>╫Ю╫в╫С╫У ╫Х╫Ы╫Х╫к╫С ╫Р╫к ╫Ф╫д╫Х╫б╫Ш...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>╫Ф╫д╫з ╫д╫Х╫б╫Ш ╫й╫Ь╫Э ╫Ю╫Ф╫к╫й╫Х╫С╫Х╫к</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
