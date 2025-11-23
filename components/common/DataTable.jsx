'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Edit, Trash2, MoreVertical, Download, Filter } from 'lucide-react';

/**
 * Fully customizable DataTable component
 * Supports: sorting, filtering, searching, pagination, actions, and custom rendering
 */
const DataTable = ({
  // Data & Columns
  columns = [],
  data = [],
  rowKey = 'id',
  
  // Search
  searchPlaceholder = 'Search...',
  enableSearch = true,
  searchFields = [], // Specific fields to search, empty = all
  
  // Pagination
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = ['10', '20', '50', '100'],
  showSizeChanger = true,
  serverSidePagination = false,
  total = 0,
  current = 1,
  onPaginationChange = null,
  
  // Sorting & Filtering
  enableSorting = true,
  enableFiltering = true,
  defaultSortField = null,
  defaultSortOrder = null,
  serverSide = false,
  onSearchChange = null,
  onFilterChange = null,
  onSortChange = null,
  
  // Actions
  onEdit = null,
  onDelete = null,
  onView = null,
  customActions = null,
  showActions = true,
  
  // Additional Features
  enableRowSelection = false,
  onRowSelectionChange = null,
  enableExport = false,
  onExport = null,
  
  // Styling & Customization
  tableSize = 'middle',
  bordered = false,
  showHeader = true,
  
  // Callbacks
  onRowClick = null,
  rowClassName = null,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Handle server-side search with debounce
  useEffect(() => {
    if (!serverSide || !onSearchChange) return;
    
    const timeoutId = setTimeout(() => {
      onSearchChange(searchText);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchText, serverSide, onSearchChange]);

  // Handle server-side filter changes
  useEffect(() => {
    if (!serverSide || !onFilterChange) return;
    onFilterChange(columnFilters);
  }, [columnFilters, serverSide, onFilterChange]);

  // Handle server-side sort changes
  useEffect(() => {
    if (!serverSide || !onSortChange) return;
    if (sortField) {
      onSortChange(sortField, sortOrder);
    }
  }, [sortField, sortOrder, serverSide, onSortChange]);

  // Filter data based on search text and column filters (client-side only)
  const filteredData = useMemo(() => {
    if (serverSide) {
      return data;
    }
    
    let filtered = data;

    // Apply search filter
    if (searchText) {
      const fieldsToSearch = searchFields.length > 0 
        ? searchFields 
        : columns.map(col => col.key);

      filtered = filtered.filter((item) => {
        return fieldsToSearch.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchText.toLowerCase());
        });
      });
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        filtered = filtered.filter((item) => {
          const recordValue = item[columnKey];
          if (recordValue === null || recordValue === undefined) return false;
          return String(recordValue).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      }
    });

    return filtered;
  }, [searchText, columnFilters, data, columns, searchFields, serverSide]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!enablePagination || serverSidePagination) {
      return filteredData;
    }
    
    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, currentPageSize, enablePagination, serverSidePagination]);

  // Get total pages
  const totalPages = useMemo(() => {
    if (serverSidePagination) {
      return Math.ceil(total / currentPageSize);
    }
    return Math.ceil(filteredData.length / currentPageSize);
  }, [filteredData.length, currentPageSize, serverSidePagination, total]);

  // Handle sorting
  const handleSort = (columnKey) => {
    if (!enableSorting) return;
    
    if (sortField === columnKey) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(columnKey);
      setSortOrder('asc');
    }
  };

  // Handle export
  const handleExport = () => {
    if (onExport) {
      onExport(filteredData, selectedRowKeys);
    } else {
      // Default CSV export
      try {
        const headers = columns.map(col => col.label).join(',');
        const rows = filteredData.map(item => {
          return columns.map(col => {
            let value = item[col.key] || '';
            const stringValue = value === null || value === undefined ? '' : String(value);
            return typeof stringValue === 'string' && stringValue.includes(',')
              ? `"${stringValue}"`
              : stringValue;
          }).join(',');
        }).join('\n');
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export data', error);
      }
    }
  };

  // Get filterable columns
  const filterableColumns = useMemo(() => {
    return columns.filter(col => 
      enableFiltering && 
      (col.filterable === true || (col.filters && col.filters.length > 0))
    );
  }, [columns, enableFiltering]);

  // Get filter options for a column
  const getFilterOptions = (columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (column && column.filters) {
      return column.filters.map(f => ({
        label: String(f.text || f),
        value: f.value !== undefined ? f.value : f,
      }));
    }
    
    const uniqueValues = [...new Set(data.map(item => item[columnKey]).filter(Boolean))];
    return uniqueValues.slice(0, 50).map(val => ({
      label: String(val),
      value: val,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden m-0">
      {/* Search and Action Bar */}
      {(enableSearch || enableFiltering || enableExport || enableRowSelection) && (
        <div className="p-5 border-b bg-gray-600">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {enableSearch && (
                <div className="relative" style={{ width: 300 }}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-9 h-10 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-sm"
                  />
                  {searchText && (
                    <button
                      type="button"
                      onClick={() => setSearchText('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/80 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {enableFiltering && filterableColumns.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowFilterPopover(!showFilterPopover)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '')
                        ? 'bg-gray-500 text-white'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {Object.values(columnFilters).filter(v => v !== null && v !== undefined && v !== '').length > 0 && (
                      <span className="px-2 py-0.5 bg-white text-gray-600 rounded-full text-xs font-medium">
                        {Object.values(columnFilters).filter(v => v !== null && v !== undefined && v !== '').length}
                      </span>
                    )}
                  </button>
                  
                  {showFilterPopover && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowFilterPopover(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 p-4 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {filterableColumns.map(col => (
                            <div key={col.key}>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                {col.label}
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={columnFilters[col.key] || ''}
                                onChange={(e) => {
                                  setColumnFilters(prev => ({
                                    ...prev,
                                    [col.key]: e.target.value || null
                                  }));
                                }}
                              >
                                <option value="">All {col.label}</option>
                                {getFilterOptions(col.key).map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setColumnFilters({});
                              setShowFilterPopover(false);
                            }}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            disabled={Object.values(columnFilters).every(v => v === null || v === undefined || v === '')}
                          >
                            Clear all filters
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {enableExport && (
                <button
                  onClick={handleExport}
                  disabled={filteredData.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              )}
              {enableRowSelection && selectedRowKeys.length > 0 && (
                <span className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm font-medium">
                  {selectedRowKeys.length} selected
                </span>
              )}
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-3 text-sm text-white">
            Showing {paginatedData.length} of {serverSidePagination ? total : filteredData.length} results
            {searchText && ` for "${searchText}"`}
            {Object.values(columnFilters).some(v => v !== null && v !== undefined && v !== '') && (
              <span> • Filters applied</span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {enableRowSelection && (
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRowKeys.length === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const keys = paginatedData.map(item => item[rowKey]);
                          setSelectedRowKeys(keys);
                          if (onRowSelectionChange) {
                            onRowSelectionChange(keys, paginatedData);
                          }
                        } else {
                          setSelectedRowKeys([]);
                          if (onRowSelectionChange) {
                            onRowSelectionChange([], []);
                          }
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider ${
                      enableSorting && col.sortable !== false ? 'cursor-pointer hover:bg-gray-200' : ''
                    }`}
                    onClick={() => enableSorting && col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {enableSorting && col.sortable !== false && (
                        <span className="text-gray-400">
                          {sortField === col.key ? (
                            sortOrder === 'asc' ? '↑' : '↓'
                          ) : (
                            '⇅'
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {showActions && (onEdit || onDelete || onView || customActions) && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item, index) => {
                const actions = [];
                if (onEdit) actions.push({ label: 'Edit', icon: Edit, onClick: () => onEdit(item), showAsIcon: true });
                if (onDelete) actions.push({ label: 'Delete', icon: Trash2, onClick: () => onDelete(item), danger: true });
                if (customActions) {
                  const custom = typeof customActions === 'function' ? customActions(item) : customActions;
                  actions.push(...(Array.isArray(custom) ? custom : []));
                }
                
                const iconActions = actions.filter(a => a.showAsIcon || (!a.danger && a.icon));
                const dropdownActions = actions.filter(a => !a.showAsIcon && (a.danger || !a.icon));
                
                return (
                  <tr
                    key={item[rowKey] || index}
                    className={`hover:bg-gray-50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${rowClassName ? rowClassName(item) : ''}`}
                    onClick={(e) => {
                      if (onRowClick && !e.target.closest('button') && !e.target.closest('select')) {
                        onRowClick(item, e);
                      }
                    }}
                  >
                    {enableRowSelection && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRowKeys.includes(item[rowKey])}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.checked) {
                              const newKeys = [...selectedRowKeys, item[rowKey]];
                              setSelectedRowKeys(newKeys);
                              if (onRowSelectionChange) {
                                onRowSelectionChange(newKeys, [...paginatedData.filter(i => newKeys.includes(i[rowKey]))]);
                              }
                            } else {
                              const newKeys = selectedRowKeys.filter(k => k !== item[rowKey]);
                              setSelectedRowKeys(newKeys);
                              if (onRowSelectionChange) {
                                onRowSelectionChange(newKeys, paginatedData.filter(i => newKeys.includes(i[rowKey])));
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                        {col.render ? col.render(item[col.key], item) : (item[col.key] ?? '-')}
                      </td>
                    ))}
                    {showActions && (onEdit || onDelete || onView || customActions) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {iconActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => action.onClick()}
                              className={`p-2 rounded transition-colors ${
                                action.danger
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title={action.label}
                            >
                              <action.icon className="w-4 h-4" />
                            </button>
                          ))}
                          {dropdownActions.length > 0 && (
                            <div className="relative">
                              <button
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                onClick={() => {
                                  // Simple dropdown - you can enhance this with a proper dropdown component
                                  const firstAction = dropdownActions[0];
                                  if (firstAction) firstAction.onClick();
                                }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchText ? 'No results found' : 'No data available'}
          </h3>
          <p className="text-sm text-gray-500">
            {searchText
              ? 'Try adjusting your search terms or filters'
              : 'Get started by adding a new record'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            {showSizeChanger && (
              <select
                value={currentPageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setCurrentPageSize(newSize);
                  setCurrentPage(1);
                  if (serverSidePagination && onPaginationChange) {
                    onPaginationChange(1, newSize);
                  }
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newPage = currentPage - 1;
                setCurrentPage(newPage);
                if (serverSidePagination && onPaginationChange) {
                  onPaginationChange(newPage, currentPageSize);
                }
              }}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                const newPage = currentPage + 1;
                setCurrentPage(newPage);
                if (serverSidePagination && onPaginationChange) {
                  onPaginationChange(newPage, currentPageSize);
                }
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

