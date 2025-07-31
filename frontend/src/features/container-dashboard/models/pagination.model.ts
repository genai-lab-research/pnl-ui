// Pagination Domain Model
// Business logic for pagination state and navigation

import { Pagination } from '../../../types/containers';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export class PaginationDomainModel {
  constructor(
    public readonly state: PaginationState
  ) {}

  static fromApiResponse(pagination: Pagination): PaginationDomainModel {
    return new PaginationDomainModel({
      currentPage: pagination.page,
      pageSize: pagination.limit,
      totalItems: pagination.total,
      totalPages: pagination.total_pages
    });
  }

  static createDefault(pageSize: number = 10): PaginationDomainModel {
    return new PaginationDomainModel({
      currentPage: 1,
      pageSize,
      totalItems: 0,
      totalPages: 0
    });
  }

  // Business logic methods
  hasNextPage(): boolean {
    return this.state.currentPage < this.state.totalPages;
  }

  hasPreviousPage(): boolean {
    return this.state.currentPage > 1;
  }

  canGoToPage(page: number): boolean {
    return page >= 1 && page <= this.state.totalPages;
  }

  getStartItem(): number {
    if (this.state.totalItems === 0) return 0;
    return (this.state.currentPage - 1) * this.state.pageSize + 1;
  }

  getEndItem(): number {
    if (this.state.totalItems === 0) return 0;
    const endItem = this.state.currentPage * this.state.pageSize;
    return Math.min(endItem, this.state.totalItems);
  }

  getPaginationText(): string {
    if (this.state.totalItems === 0) {
      return 'No items found';
    }
    
    const start = this.getStartItem();
    const end = this.getEndItem();
    const total = this.state.totalItems;
    
    return `${start}-${end} of ${total} items`;
  }

  getPageText(): string {
    if (this.state.totalPages === 0) {
      return 'Page 0 of 0';
    }
    return `Page ${this.state.currentPage} of ${this.state.totalPages}`;
  }

  getAvailablePageSizes(): number[] {
    return [10, 25, 50, 100];
  }

  isValidPageSize(size: number): boolean {
    return this.getAvailablePageSizes().includes(size);
  }

  withPage(page: number): PaginationDomainModel {
    if (!this.canGoToPage(page)) {
      return this;
    }
    
    return new PaginationDomainModel({
      ...this.state,
      currentPage: page
    });
  }

  withPageSize(pageSize: number): PaginationDomainModel {
    if (!this.isValidPageSize(pageSize)) {
      return this;
    }

    // When changing page size, reset to first page
    return new PaginationDomainModel({
      ...this.state,
      currentPage: 1,
      pageSize,
      // Recalculate total pages
      totalPages: Math.ceil(this.state.totalItems / pageSize)
    });
  }

  nextPage(): PaginationDomainModel {
    return this.withPage(this.state.currentPage + 1);
  }

  previousPage(): PaginationDomainModel {
    return this.withPage(this.state.currentPage - 1);
  }

  firstPage(): PaginationDomainModel {
    return this.withPage(1);
  }

  lastPage(): PaginationDomainModel {
    return this.withPage(this.state.totalPages);
  }

  // Helper methods for UI
  getPageNumbers(maxVisible: number = 5): number[] {
    const { currentPage, totalPages } = this.state;
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end pages to show
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);
      
      // Adjust if we're near the beginning or end
      if (endPage - startPage < maxVisible - 1) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisible - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  shouldShowEllipsis(): { start: boolean; end: boolean } {
    const { currentPage, totalPages } = this.state;
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    return {
      start: currentPage - halfVisible > 1,
      end: currentPage + halfVisible < totalPages
    };
  }

  isEmpty(): boolean {
    return this.state.totalItems === 0;
  }

  isSinglePage(): boolean {
    return this.state.totalPages <= 1;
  }
}
