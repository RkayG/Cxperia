import { MessageSquare } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface RecentSalesProps {
  feedbackData: any[];
  isLoading: boolean;
}

export function RecentSales({ feedbackData, isLoading }: RecentSalesProps) {
  // Get the 5 most recent feedbacks
  const recentFeedbacks = feedbackData
    .sort((a, b) => new Date(b.created_at || b.createdAt || '').getTime() - new Date(a.created_at || a.createdAt || '').getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
            <div className="ml-4 space-y-1 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (recentFeedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-muted-foreground">No feedback received yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Feedback will appear here when customers submit reviews
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recentFeedbacks.map((feedback, index) => {
        // Generate initials from customer name or email
        const customerName = feedback.customer_name || feedback.customerName || `Customer ${index + 1}`;
        const email = feedback.customer_email || feedback.customerEmail || '';
        const initials = customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        
        // Format date
        const date = feedback.created_at || feedback.createdAt;
        const timeAgo = date ? new Date(date).toLocaleDateString() : 'Recently';
        
        // Get rating or feedback type
        const rating = feedback.rating || feedback.overall_rating || 0;
        const ratingDisplay = rating > 0 ? `${rating}★` : 'New';

        return (
          <div key={feedback.id || index} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-1">
              <p className="text-sm font-medium leading-none">{customerName}</p>
              <p className="text-sm text-muted-foreground">
                {email || timeAgo}
              </p>
            </div>
            <div className="ml-auto font-medium text-sm">
              {ratingDisplay}
            </div>
          </div>
        );
      })}
    </div>
  )
}
