// src/config/filterConfig.js
export const PAGE_FILTERS = {
  '/': [ 
    { id: 'status', label: 'Status', type: 'checkbox', dataKey: 'status' },
    { id: 'brand_name', label: 'Brand', type: 'searchable', dataKey: 'brand_name' },
    // CHANGED: matched with the mapped property in DailyStackView
    { id: 'type_name', label: 'Post Type', type: 'checkbox', dataKey: 'post_type' }, 
    { id: 'ready_by_name', label: 'Staff', type: 'checkbox', dataKey: 'ready_by_name' }
  ],
  '/brands': [
    { id: 'brand_status', label: 'Entity Status', type: 'checkbox', dataKey: 'is_active' },
    { id: 'brand_name', label: 'Search Name', type: 'searchable', dataKey: 'brand_name' }
  ],
  '/enquiry': [
    { id: 'global_search', label: 'Global Search', type: 'searchable', dataKey: 'global' }, 
    { id: 'brand_name', label: 'Our Brand', type: 'checkbox', dataKey: 'brand_name' },
    { id: 'service_name', label: 'Our Service', type: 'searchable', dataKey: 'service_name' },
    { id: 'enquiry_status', label: 'Enquiry Status', type: 'checkbox', dataKey: 'enquiry_status' },
    { id: 'budget_range', label: 'Budget Range', type: 'checkbox', dataKey: 'budget_range' }
  ]
};