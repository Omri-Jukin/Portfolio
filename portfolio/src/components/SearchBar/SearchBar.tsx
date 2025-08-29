"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Fade,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { SearchBarProps, SearchResult } from "./SearchBar.type";
import {
  mockSearchResults,
  popularSearchTerms,
  getTypeIcon,
  getTypeColor,
} from "./SearchBar.const";
import {
  SearchContainer,
  SearchSuggestions,
  PopularSearchesContainer,
  SearchTermChip,
} from "./SearchBar.style";

export default function SearchBar({
  placeholder = "Search projects, blog posts, skills...",
  onSearch,
  onResultSelect,
  showSuggestions = true,
  fullWidth = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(searchQuery);
    }

    if (searchQuery.trim() === "") {
      setResults([]);
      return;
    }

    // Mock search logic - in real app, this would call an API
    const filteredResults = mockSearchResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filteredResults.slice(0, 5)); // Limit to 5 results
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  return (
    <SearchContainer sx={{ width: fullWidth ? "100%" : "auto" }}>
      <TextField
        fullWidth={fullWidth}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        variant="outlined"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "background.default",
            },
            "&.Mui-focused": {
              backgroundColor: "background.paper",
            },
          },
        }}
      />

      {/* Search Suggestions */}
      {showSuggestions && isFocused && results.length > 0 && (
        <Fade in={isFocused && results.length > 0}>
          <SearchSuggestions elevation={8}>
            <List dense>
              {results.map((result) => (
                <ListItem key={result.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleResultSelect(result)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>
                        {getTypeIcon(result.type)}
                      </Typography>

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: getTypeColor(result.type),
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {result.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.url}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {result.title}
                        </Typography>

                        {result.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {result.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </SearchSuggestions>
        </Fade>
      )}

      {/* Popular Searches */}
      {showSuggestions && isFocused && query === "" && (
        <Fade in={isFocused && query === ""}>
          <PopularSearchesContainer elevation={8}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Popular Searches
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {popularSearchTerms.map((term) => (
                  <SearchTermChip
                    key={term}
                    variant="body2"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </SearchTermChip>
                ))}
              </Box>
            </Box>
          </PopularSearchesContainer>
        </Fade>
      )}
    </SearchContainer>
  );
}
