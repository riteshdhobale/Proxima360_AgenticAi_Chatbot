
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

export const SearchFilterPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const stores = ['STORE-1', 'STORE-2', 'STORE-3', 'STORE-4', 'STORE-5', 'STORE-6', 'STORE-7'];
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'];
  const transportModes = ['Ground', 'Air', 'Sea', 'Express', 'Standard'];

  const handleSearch = () => {
    console.log('Searching with:', {
      query: searchQuery,
      store: selectedStore,
      category: selectedCategory,
      transport: selectedTransport,
      dateFrom,
      dateTo
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStore('');
    setSelectedCategory('');
    setSelectedTransport('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setActiveFilters([]);
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Premium background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="text-white" size={16} />
          </div>
          <h2 className="font-semibold text-white text-lg">Search & Filter</h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-white/90 font-medium">Search Query</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search allocations, stores, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-white/10 backdrop-blur-sm border-white/20 focus:border-blue-400/50 text-white placeholder:text-white/60 rounded-xl"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
          </div>
        </div>

        {/* Store Filter */}
        <div className="space-y-2">
          <Label className="text-white/90 font-medium">Store</Label>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-blue-400/50 text-white rounded-xl hover:bg-white/15 transition-all">
              <SelectValue placeholder="Select store" className="text-white/80" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
              {stores.map((store) => (
                <SelectItem
                  key={store}
                  value={store}
                  className="text-white hover:bg-white/10 focus:bg-white/20 cursor-pointer"
                >
                  {store}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-white/90 font-medium">Product Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-blue-400/50 text-white rounded-xl hover:bg-white/15 transition-all">
              <SelectValue placeholder="Select category" className="text-white/80" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-white hover:bg-white/10 focus:bg-white/20 cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transport Mode Filter */}
        <div className="space-y-2">
          <Label className="text-white/90 font-medium">Transport Mode</Label>
          <Select value={selectedTransport} onValueChange={setSelectedTransport}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 focus:border-blue-400/50 text-white rounded-xl hover:bg-white/15 transition-all">
              <SelectValue placeholder="Select transport mode" className="text-white/80" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
              {transportModes.map((mode) => (
                <SelectItem
                  key={mode}
                  value={mode}
                  className="text-white hover:bg-white/10 focus:bg-white/20 cursor-pointer"
                >
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-white/90 font-medium">Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 text-white rounded-xl"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-xl border-white/20 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 text-white rounded-xl"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-xl border-white/20 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label className="text-white/90 font-medium">Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            {['Low Stock', 'Delayed', 'In Transit', 'Completed', 'High Priority'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (activeFilters.includes(filter)) {
                    setActiveFilters(activeFilters.filter(f => f !== filter));
                  } else {
                    setActiveFilters([...activeFilters, filter]);
                  }
                }}
                className={`text-xs rounded-lg transition-all ${activeFilters.includes(filter)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:from-blue-600 hover:to-purple-700'
                    : 'bg-white/10 backdrop-blur-sm border-white/20 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results Preview */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl">
          <h3 className="font-medium text-white mb-3 flex items-center space-x-2">
            <Filter className="text-blue-400" size={16} />
            <span>Search Results Preview</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Allocations:</span>
              <span className="font-medium text-white bg-blue-500/20 px-2 py-1 rounded-lg">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Active Stores:</span>
              <span className="font-medium text-white bg-green-500/20 px-2 py-1 rounded-lg">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">In Transit:</span>
              <span className="font-medium text-white bg-yellow-500/20 px-2 py-1 rounded-lg">23</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-white/10 space-y-3 relative z-10">
        <Button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Search className="mr-2" size={16} />
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white/80 hover:bg-white/20 hover:text-white rounded-xl transition-all"
        >
          <X className="mr-2" size={16} />
          Clear All
        </Button>
      </div>
    </div>
  );
};
