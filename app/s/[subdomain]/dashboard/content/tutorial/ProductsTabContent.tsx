import ProductUsedCard from './ProductsUsedCard';
import type { Tutorial } from './page';
export const ProductsTabContent: React.FC<{ tutorial: Tutorial }> = ({  tutorial }) => (


<div className="p-6">
  <h2 className="text-xl font-semibold mb-6">Product Overview</h2>

  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <p className="text-sm text-blue-800">
      This section shows all products used across your tutorial steps. Products
      are automatically gathered from individual steps.
    </p>
  </div>

  <div className="space-y-4">
    {tutorial.steps.map(
      (step) =>
        step.products.length > 0 && (
          <div key={step.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Step {step.stepNumber}: {step.title || "Untitled Step"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {step.products.map((product) => (
                <ProductUsedCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )
    )}  

    {tutorial.steps.every((step) => step.products.length === 0) && (
      <div className="text-center py-8 text-gray-500">
        No products added yet. Add products to your tutorial steps to see them
        here.
      </div>
    )}
  </div>

</div>

    
)

export default ProductsTabContent;