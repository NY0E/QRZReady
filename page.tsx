'use client';
import { useState, useEffect } from 'react';
import { ExamCard } from './components/ExamCard';
import { getExamData, getCacheInfo } from './utils/examData';

interface QuestionCounts {
  technician: number;
  general: number;
  extra: number;
}

interface LoadingStates {
  technician: boolean;
  general: boolean;
  extra: boolean;
}

export default function HomePage(): JSX.Element {
  const [questionCounts, setQuestionCounts] = useState<QuestionCounts>({
    technician: 0,
    general: 0,
    extra: 0
  });
  
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    technician: true,
    general: true,
    extra: true
  });

  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    loadQuestionCounts();
  }, []);

  const loadQuestionCounts = async (): Promise<void> => {
    const examTypes = ['technician', 'general', 'extra'] as const;
    
    // Load each exam type in parallel
    const promises = examTypes.map(async (examType) => {
      try {
        const data = await getExamData(examType);
        const count = data?.questions?.length || 0;
        
        setQuestionCounts(prev => ({
          ...prev,
          [examType]: count
        }));
        
        setLoadingStates(prev => ({
          ...prev,
          [examType]: false
        }));
        
        return { examType, count, success: true };
      } catch (error) {
        console.error(`Failed to load ${examType} questions:`, error);
        
        setLoadingStates(prev => ({
          ...prev,
          [examType]: false
        }));
        
        return { examType, count: 0, success: false };
      }
    });

    // Wait for all to complete
    const results = await Promise.all(promises);
    
    // Check if all loaded successfully
    const allSuccess = results.every(result => result.success);
    setAllLoaded(allSuccess);
    
    // Log cache info for debugging
    console.log('Cache info:', getCacheInfo());
  };

  const isLoading = Object.values(loadingStates).some(loading => loading);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hack The Ham
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Hack your way to Amateur Radio license success with smart memorization techniques
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Focus on Memorization
            </h3>
            <p className="text-blue-800">
              Ham radio exams require memorizing specific answers. Hack The Ham uses proven spaced repetition 
              to help you memorize the correct answers efficiently.
            </p>
          </div>
          
          {isLoading && (
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Loading latest questions from GitHub...</span>
            </div>
          )}
          
          {!isLoading && allLoaded && (
            <div className="text-green-600 text-sm font-medium">
              ✅ All question pools loaded successfully
            </div>
          )}
          
          {!isLoading && !allLoaded && (
            <div className="text-orange-600 text-sm">
              ⚠️ Using cached question data
            </div>
          )}
        </div>

        {/* Exam Selection */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Choose Your License Level
          </h2>
          
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            <ExamCard
              title="Technician License"
              description="Entry level • VHF/UHF privileges"
              examType="technician"
              questionCount={questionCounts.technician}
              isLoading={loadingStates.technician}
              difficulty="Beginner"
              examInfo={{
                questions: 35,
                passingScore: 26,
                timeLimit: '60 minutes'
              }}
            />
            
            <ExamCard
              title="General License"
              description="HF privileges • DXing capabilities"
              examType="general"
              questionCount={questionCounts.general}
              isLoading={loadingStates.general}
              difficulty="Intermediate"
              examInfo={{
                questions: 35,
                passingScore: 26,
                timeLimit: '60 minutes'
              }}
            />
            
            <ExamCard
              title="Extra License"
              description="Full privileges • All frequencies"
              examType="extra"
              questionCount={questionCounts.extra}
              isLoading={loadingStates.extra}
              difficulty="Advanced"
              examInfo={{
                questions: 50,
                passingScore: 37,
                timeLimit: '60 minutes'
              }}
            />
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Questions</h3>
              <p className="text-gray-600">
                Start with 10-question study sets using adaptive difficulty
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Memory</h3>
              <p className="text-gray-600">
                Repeat questions until memorized through spaced repetition
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Practice Tests</h3>
              <p className="text-gray-600">
                Test your recall with realistic exam simulations
              </p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Resources & Links
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">📡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visit NY0E.com
              </h3>
              <p className="text-gray-600 mb-4">
                Learn more about my ham radio projects, technical articles, and other tools for the amateur radio community.
              </p>
              <a 
                href="https://ny0e.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visit NY0E.com
                <span className="text-sm">↗</span>
              </a>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-4">📮</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Protect Your Privacy
              </h3>
              <p className="text-gray-600 mb-4">
                Get a virtual mailbox with iPostal1 to keep your home address private when applying for ham radio licenses.
              </p>
              <a 
                href="https://ipostal1.com/?ref=6716" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Learn About iPostal1
                <span className="text-sm">↗</span>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              <strong>Questions or feedback?</strong> Contact me via <a href="https://ny0e.com" className="text-blue-600 hover:text-blue-700">NY0E.com</a> or find me on <a href="https://www.qrz.com/db/NY0E" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">QRZ.com</a>
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Question pools sourced from official NCVEC databases • Cached locally for performance
          </p>
        </div>
      </div>
    </div>
  );
}
