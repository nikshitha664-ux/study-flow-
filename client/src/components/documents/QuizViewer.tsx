import React, { useState } from 'react';
import { QuizData } from '../../types';
import { CheckCircle, XCircle, Award, RotateCcw, HelpCircle } from 'lucide-react';

interface QuizViewerProps {
  quiz: QuizData;
  onReset?: () => void;
}

export const QuizViewer: React.FC<QuizViewerProps> = ({ quiz, onReset }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (userAnswers[q.questionId] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="bg-[#131A27] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>{quiz.quizTitle || 'Document Knowledge Quiz'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Test your comprehension based on extracted document content</p>
        </div>
        {submitted && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Score: {calculateScore()} / {quiz.questions.length}
            </span>
            <button
              onClick={() => { setSubmitted(false); setUserAnswers({}); onReset?.(); }}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Retake Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const selected = userAnswers[q.questionId];
          const isCorrect = selected === q.correctAnswerIndex;

          return (
            <div key={q.questionId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                {idx + 1}. {q.questionText}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let btnStyle = "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800";
                  if (selected === optIdx) {
                    btnStyle = "bg-blue-600/30 text-blue-200 border-blue-500/50";
                  }
                  if (submitted) {
                    if (optIdx === q.correctAnswerIndex) {
                      btnStyle = "bg-emerald-600/30 text-emerald-200 border-emerald-500/50";
                    } else if (selected === optIdx && !isCorrect) {
                      btnStyle = "bg-rose-600/30 text-rose-200 border-rose-500/50";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.questionId, optIdx)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      {submitted && selected === optIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-blue-400">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 shadow-lg shadow-blue-500/20 transition-all"
        >
          Submit Answers
        </button>
      )}
    </div>
  );
};
