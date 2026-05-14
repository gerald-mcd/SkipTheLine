import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { venues } from "@/lib/mock-data";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { VenueDetailBody } from "@/components/VenueDetailBody";

export const Route = createFileRoute("/venue/$id")({
  head: ({ params }) => {
    const v = venues.find((x) => x.id === params.id);
    return {
      meta: [
        { title: v ? `${v.name} — ${v.waitMinutes}m wait now` : "Venue" },
        { name: "description", content: v ? `Live wait time at ${v.name}: ${v.waitMinutes} minutes.` : "Venue details" },
      ],
    };
  },
  component: VenueDetail,
  notFoundComponent: () => <div className="p-8 text-center">Venue not found</div>,
});

function VenueDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const v = venues.find((x) => x.id === id);
  if (!v) return null;

  return (
    <VenueDetailBody
      venue={v}
      headerOverlay={
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate({ to: "/explore" })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur" aria-label="Favorite">
              <Heart className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    />
  );
}
