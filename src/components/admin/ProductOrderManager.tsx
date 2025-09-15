"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Save, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";

type ProductOrderManagerProps = {
  onOrderChanged?: () => void;
};

interface SortableProduct extends Product {
  order?: number;
}

function SortableProductItem({ 
  product, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}: { 
  product: SortableProduct;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1 flex items-center gap-3">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-12 h-12 object-cover rounded border"
        />
        <div className="flex-1">
          <h3 className="font-medium text-sm">{product.name}</h3>
          <p className="text-xs text-gray-500">#{product.order ?? '?'}</p>
        </div>
      </div>

      {/* Mobile-friendly arrow buttons */}
      <div className="flex flex-col gap-1 md:hidden">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ProductOrderManager({ onOrderChanged }: ProductOrderManagerProps) {
  const [products, setProducts] = useState<SortableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      // Ensure all products have an order value and sort them
      const productsWithOrder = data.map((product, index) => ({
        ...product,
        order: product.order ?? index + 1,
      }));

      // Sort by order, then by id for products without order
      const sortedProducts = productsWithOrder.sort((a, b) => {
        if (a.order && b.order) {
          return a.order - b.order;
        }
        if (a.order && !b.order) {
          return -1;
        }
        if (!a.order && b.order) {
          return 1;
        }
        return a.id.localeCompare(b.id);
      });

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveProduct = (productId: string, direction: 'up' | 'down') => {
    setProducts((items) => {
      const currentIndex = items.findIndex((item) => item.id === productId);
      if (currentIndex === -1) return items;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= items.length) return items;

      const newItems = [...items];
      [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];

      // Update order values based on new positions
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setHasChanges(true);
      return updatedItems;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order values based on new positions
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        setHasChanges(true);
        return updatedItems;
      });
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    
    try {
      console.log("Saving products with order:", products.map(p => ({ id: p.id, name: p.name, order: p.order })));
      
      // Update all products with their new order values
      const updatePromises = products.map((product) =>
        supabase
          .from("products")
          .update({ order: product.order })
          .eq("id", product.id)
      );

      const results = await Promise.all(updatePromises);
      
      // Check if any updates failed
      const hasErrors = results.some((result) => result.error);
      
      if (hasErrors) {
        console.error("Some updates failed:", results.filter(r => r.error));
        alert("Failed to save some product orders. Check console for details.");
      } else {
        setHasChanges(false);
        onOrderChanged?.();
        alert("Product order saved successfully!");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save product order");
    } finally {
      setSaving(false);
    }
  };

  const resetOrder = () => {
    fetchProducts();
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Product Order Manager</h2>
        <div className="text-center py-8">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Product Order Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={resetOrder}
            disabled={!hasChanges}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={saveOrder}
            disabled={!hasChanges || saving}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <div className="hidden md:block">
          Drag and drop products to reorder them. Lower numbers appear first.
        </div>
        <div className="md:hidden">
          Use the arrow buttons to reorder products, or drag the grip handle. Lower numbers appear first.
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {products.map((product, index) => (
              <SortableProductItem 
                key={product.id} 
                product={product}
                onMoveUp={() => moveProduct(product.id, 'up')}
                onMoveDown={() => moveProduct(product.id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < products.length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {hasChanges && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          You have unsaved changes. Click &quot;Save Order&quot; to apply them.
        </div>
      )}
    </div>
  );
}
