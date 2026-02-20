/**
 * Corporate Customer Utilities
 * Handles corporate code validation and discount application
 */

export interface CorporateCustomer {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  taxId: string;
  address: string;
  employees: string;
  corporateCode: string;
  discount: number; // Percentage
  status: 'active' | 'inactive' | 'suspended';
  registeredDate: string;
  bookingCount: number;
}

/**
 * Validate corporate code
 */
export function validateCorporateCode(code: string): {
  isValid: boolean;
  corporate: CorporateCustomer | null;
  discount: number;
} {
  if (!code || !code.trim()) {
    return { isValid: false, corporate: null, discount: 0 };
  }

  try {
    // Get corporate customers from localStorage
    const corporates: CorporateCustomer[] = JSON.parse(
      localStorage.getItem('at_corporate_customers') || '[]'
    );

    // Find matching corporate customer
    const corporate = corporates.find(
      c => c.corporateCode.toUpperCase() === code.trim().toUpperCase() && c.status === 'active'
    );

    if (corporate) {
      return {
        isValid: true,
        corporate: corporate,
        discount: corporate.discount
      };
    }

    return { isValid: false, corporate: null, discount: 0 };
  } catch (error) {
    console.error('Error validating corporate code:', error);
    return { isValid: false, corporate: null, discount: 0 };
  }
}

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): {
  originalPrice: number;
  discount: number;
  discountAmount: number;
  finalPrice: number;
} {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discount: discountPercentage,
    discountAmount,
    finalPrice
  };
}

/**
 * Calculate total price with corporate discount
 */
export function calculateTotalWithDiscount(
  services: { name: string; price: number }[],
  corporateCode?: string
): {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  isCorporate: boolean;
  companyName?: string;
} {
  // Calculate subtotal
  const subtotal = services.reduce((sum, service) => sum + service.price, 0);

  // Check for corporate discount
  if (corporateCode) {
    const validation = validateCorporateCode(corporateCode);
    
    if (validation.isValid && validation.corporate) {
      const discountAmount = (subtotal * validation.discount) / 100;
      const total = subtotal - discountAmount;

      return {
        subtotal,
        discountPercentage: validation.discount,
        discountAmount,
        total,
        isCorporate: true,
        companyName: validation.corporate.companyName
      };
    }
  }

  // No discount
  return {
    subtotal,
    discountPercentage: 0,
    discountAmount: 0,
    total: subtotal,
    isCorporate: false
  };
}

/**
 * Format currency (LKR)
 */
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Increment booking count for corporate customer
 */
export function incrementCorporateBookingCount(corporateCode: string): void {
  try {
    const corporates: CorporateCustomer[] = JSON.parse(
      localStorage.getItem('at_corporate_customers') || '[]'
    );

    const updatedCorporates = corporates.map(c =>
      c.corporateCode === corporateCode
        ? { ...c, bookingCount: c.bookingCount + 1 }
        : c
    );

    localStorage.setItem('at_corporate_customers', JSON.stringify(updatedCorporates));
  } catch (error) {
    console.error('Error incrementing booking count:', error);
  }
}

/**
 * Get corporate customer by code
 */
export function getCorporateCustomer(code: string): CorporateCustomer | null {
  try {
    const corporates: CorporateCustomer[] = JSON.parse(
      localStorage.getItem('at_corporate_customers') || '[]'
    );

    return corporates.find(c => c.corporateCode === code) || null;
  } catch (error) {
    console.error('Error getting corporate customer:', error);
    return null;
  }
}

/**
 * Get all corporate customers (for admin)
 */
export function getAllCorporateCustomers(): CorporateCustomer[] {
  try {
    return JSON.parse(localStorage.getItem('at_corporate_customers') || '[]');
  } catch (error) {
    console.error('Error getting corporate customers:', error);
    return [];
  }
}

/**
 * Generate corporate booking summary for email
 */
export function generateCorporateBookingSummary(
  services: { name: string; price: number }[],
  corporateCode: string
): string {
  const pricing = calculateTotalWithDiscount(services, corporateCode);
  const corporate = getCorporateCustomer(corporateCode);

  return `
    <div style="background: #FFF9E6; padding: 15px; border-left: 4px solid #FFD700; margin: 20px 0; border-radius: 4px;">
      <strong style="color: #000; display: block; margin-bottom: 10px;">🏢 Corporate Customer Benefits Applied</strong>
      
      <p style="margin: 5px 0; color: #666;">
        <strong>Company:</strong> ${corporate?.companyName || 'N/A'}
      </p>
      
      <p style="margin: 5px 0; color: #666;">
        <strong>Corporate Code:</strong> ${corporateCode}
      </p>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #FFD700;">
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="padding: 5px 0; color: #666;">Subtotal:</td>
            <td style="padding: 5px 0; text-align: right; color: #000;">${formatCurrency(pricing.subtotal)}</td>
          </tr>
          <tr style="color: #10B981;">
            <td style="padding: 5px 0;">Corporate Discount (${pricing.discountPercentage}%):</td>
            <td style="padding: 5px 0; text-align: right; font-weight: bold;">-${formatCurrency(pricing.discountAmount)}</td>
          </tr>
          <tr style="border-top: 2px solid #FFD700; font-weight: bold; font-size: 16px;">
            <td style="padding: 10px 0; color: #000;">Total Amount:</td>
            <td style="padding: 10px 0; text-align: right; color: #FFD700;">${formatCurrency(pricing.total)}</td>
          </tr>
        </table>
      </div>
      
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        You saved ${formatCurrency(pricing.discountAmount)} with your corporate discount!
      </p>
    </div>
  `;
}

export default {
  validateCorporateCode,
  calculateDiscountedPrice,
  calculateTotalWithDiscount,
  formatCurrency,
  incrementCorporateBookingCount,
  getCorporateCustomer,
  getAllCorporateCustomers,
  generateCorporateBookingSummary
};