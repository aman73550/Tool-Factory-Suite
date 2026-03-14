import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSubmitFeedback } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

export function StarRating({ toolSlug }: { toolSlug: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const submitMut = useSubmitFeedback();

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      await submitMut.mutateAsync({
        data: { toolSlug, rating, comment }
      });
      setSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully."
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-primary/5 rounded-2xl border border-primary/20">
        <Star className="w-12 h-12 text-amber-400 fill-amber-400 mx-auto mb-4" />
        <h4 className="font-display font-bold text-xl mb-2 text-foreground">Thank you for your rating!</h4>
        <p className="text-muted-foreground">We appreciate your feedback to help improve our tools.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow border p-6 md:p-8">
      <h3 className="font-display font-bold text-2xl mb-2 text-foreground">Rate this tool</h3>
      <p className="text-muted-foreground mb-6">Let us know what you think to help others!</p>
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              className={`w-10 h-10 ${
                star <= (hover || rating) 
                  ? 'fill-amber-400 text-amber-400 drop-shadow-md' 
                  : 'text-muted-foreground/30 fill-transparent'
              } transition-all duration-200`} 
            />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Textarea 
          placeholder="Optional: leave a comment about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none min-h-[100px] bg-background"
        />
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || submitMut.isPending}
          className="w-full sm:w-auto px-8"
        >
          {submitMut.isPending ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
}
