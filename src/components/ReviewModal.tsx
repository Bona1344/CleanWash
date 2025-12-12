import { useState } from "react";
import { X, Star, Send } from "lucide-react";
import StarRating from "./StarRating";

interface ReviewModalProps {
  shopId: string;
  shopName: string;
  customerId: string | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ shopId, shopName, customerId, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
        alert("Please select a star rating!");
        return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          shopId,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        alert("Thanks for your review! 🌟");
        onSuccess();
        onClose();
      } else {
        alert("Something went wrong.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate your experience</h3>
            <p className="text-gray-500">How was your service with <span className="font-bold text-blue-600">{shopName}</span>?</p>
        </div>

        <div className="flex justify-center mb-8">
            <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                    >
                        <Star 
                            size={40} 
                            className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"}`} 
                            strokeWidth={star <= rating ? 0 : 1}
                        />
                    </button>
                 ))}
            </div>
        </div>

        <div className="space-y-4">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 min-h-[120px] resize-none"
            />
            
            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {submitting ? "Posting..." : <>Post Review <Send className="h-4 w-4" /></>}
            </button>
        </div>
      </div>
    </div>
  );
}
