"use client";

import { useState } from "react";
import {
  Star,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useReorderTestimonial,
  useProfile,
} from "@/hooks";
import { useToast } from "@/providers/toastProvider";
import type { TestimonialRecord } from "@repo/db-config";

interface SortableTestimonialCardProps {
  testimonial: TestimonialRecord;
  idx: number;
  total: number;
  isAdmin: boolean;
  onEdit: (t: TestimonialRecord) => void;
  onDelete: (id: number, name: string) => void;
  onMoveOrder: (t: TestimonialRecord, direction: "up" | "down") => void;
  isPending: boolean;
}

function SortableTestimonialCard({
  testimonial: t,
  idx,
  total,
  isAdmin,
  onEdit,
  onDelete,
  onMoveOrder,
  isPending,
}: SortableTestimonialCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between transition-all select-none ${isDragging
        ? "shadow-2xl scale-[1.03] z-30 opacity-90 ring-2 ring-amber-500/40 relative"
        : "hover:shadow-md"
        }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {t.image ? (
              <img
                src={t.image}
                alt={t.customerName}
                className="w-10 h-10 rounded-full object-cover shadow-xs pointer-events-none"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                {t.customerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-800 leading-none">
                {t.customerName}
              </h4>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= t.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">
              #{t.displayOrder}
            </span>
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors touch-none"
              title="Drag to reorder review"
            >
              <GripVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">
          &quot;{t.review}&quot;
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveOrder(t, "up")}
            disabled={idx === 0 || isPending}
            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-20 cursor-pointer"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveOrder(t, "down")}
            disabled={idx === total - 1 || isPending}
            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-20 cursor-pointer"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(t)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            title="Edit Review"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(t.id, t.customerName)}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Review (Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsTab() {
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";
  const { data: testimonialsData, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const reorderTestimonial = useReorderTestimonial();
  const { toast } = useToast();

  const testimonials = testimonialsData?.testimonials || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialRecord | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setCustomerName("");
    setRating(5);
    setReview("");
    setImageFile(null);
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (t: TestimonialRecord) => {
    setEditingTestimonial(t);
    setCustomerName(t.customerName);
    setRating(t.rating || 5);
    setReview(t.review);
    setImageFile(null);
    setImageUrl(t.image || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("customerName", customerName);
    formData.append("rating", String(rating));
    formData.append("review", review);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      if (editingTestimonial) {
        await updateTestimonial.mutateAsync({
          id: editingTestimonial.id,
          payload: formData,
        });
        toast.success(`Review from "${customerName}" updated!`, "Review Saved");
      } else {
        await createTestimonial.mutateAsync(formData);
        toast.success(`Review from "${customerName}" added!`, "Review Added");
      }
      closeModal();
    } catch (err) {
      toast.error(err, "Review Error");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete review by "${name}"?`))
      return;
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success(`Review by "${name}" deleted.`, "Review Removed");
    } catch (err) {
      toast.error(err, "Delete Failed");
    }
  };

  const handleMoveOrder = async (
    t: TestimonialRecord,
    direction: "up" | "down",
  ) => {
    const currentIndex = testimonials.findIndex((item) => item.id === t.id);
    if (currentIndex === -1) return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const target = testimonials[targetIndex];
    if (!target) return;

    try {
      await reorderTestimonial.mutateAsync({
        id: t.id,
        displayOrder: target.displayOrder,
      });
      toast.success(
        `Position moved ${direction} successfully!`,
        "Order Updated",
      );
    } catch (err) {
      toast.error(err, "Reorder Failed");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testimonials.findIndex(
      (item) => item.id === Number(active.id),
    );
    const newIndex = testimonials.findIndex(
      (item) => item.id === Number(over.id),
    );
    if (oldIndex === -1 || newIndex === -1) return;

    const target = testimonials[newIndex];
    if (!target) return;

    try {
      await reorderTestimonial.mutateAsync({
        id: Number(active.id),
        displayOrder: target.displayOrder,
      });
      toast.success("Testimonial display order updated!", "Reordered");
    } catch (err) {
      toast.error(err, "Reorder Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Customer Testimonials
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Manage verified client reviews with 1–5 star ratings and drag cards
            to reorder.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-linear-to-tl from-amber-500 to-orange-400 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            No Testimonials Added
          </h4>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Showcase customer satisfaction on your public homepage.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-linear-to-tl from-amber-500 to-orange-400 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={testimonials.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <SortableTestimonialCard
                  key={t.id}
                  testimonial={t}
                  idx={idx}
                  total={testimonials.length}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onMoveOrder={handleMoveOrder}
                  isPending={reorderTestimonial.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h4 className="text-sm font-bold text-slate-800">
                {editingTestimonial ? "Edit Review" : "Add Customer Review"}
              </h4>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-3.5 overflow-y-auto flex-1"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikramaditya Oberoi"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} out of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Review Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share the customer's positive experience..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Customer Avatar / Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                />
                {imageUrl && !imageFile && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    Current: {imageUrl}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createTestimonial.isPending || updateTestimonial.isPending
                  }
                  className="px-4 py-1.5 bg-linear-to-tl from-amber-500 to-orange-400 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {(createTestimonial.isPending ||
                    updateTestimonial.isPending) && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                  <span>{editingTestimonial ? "Update" : "Save Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
