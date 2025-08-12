# Documentation Audit & Cleanup Plan

## Current Documentation Status

### 📋 Documentation Inventory

**Root Level (`/new-app/`)**:
- `CLAUDE.md` (211 lines) - ✅ **ESSENTIAL** - Main project instructions
- `SCHEDULE_CONTEXT_REQUIREMENTS.md` (294 lines) - ✅ **ESSENTIAL** - Critical architecture analysis  
- `IMPLEMENTATION_PLAN.md` (180 lines) - ✅ **ESSENTIAL** - Step-by-step implementation plan
- `MINIMUM_VIABLE_SCHEDULE_PLAN.md` (263 lines) - ✅ **ESSENTIAL** - Foundation for getting started

**Docs Directory (`/docs/`)**:
- `README.md` (59 lines) - ✅ **KEEP** - Good overview
- `API_ENDPOINTS.md` (328 lines) - ⚠️ **TOO DETAILED** - Comprehensive but overwhelming
- `DATA_MODEL_SIMPLE.md` (214 lines) - ✅ **REFERENCE** - Useful for schema questions
- `BUSINESS_WORKFLOWS.md` (230 lines) - ⚠️ **TOO DETAILED** - Advanced features
- `AUTH_SPECS.md` (207 lines) - ⚠️ **TOO DETAILED** - Implementation minutiae
- `PROJECT_STRUCTURE_PLAN.md` (104 lines) - ✅ **REFERENCE** - Deployment info

**Frontend-Specific**:
- `frontend/CLAUDE.md` (190 lines) - ✅ **ESSENTIAL** - Frontend development guide
- `frontend/MENU_MIGRATION_STATUS.md` (140 lines) - ✅ **USEFUL** - Tracks migration progress
- `frontend/ARCHITECTURE.md` (80 lines) - ⚠️ **REDUNDANT** - Overlaps with SUMMARY.md
- `frontend/SUMMARY.md` (85 lines) - ⚠️ **REDUNDANT** - Overlaps with ARCHITECTURE.md

## Problems Identified

### 1. **Information Overload**
- Total: **1,500+ lines** of documentation  
- `docs/` directory has **1,142 lines** of detailed specs
- Too much detail for immediate implementation needs

### 2. **Redundancy Issues**
- `frontend/ARCHITECTURE.md` vs `frontend/SUMMARY.md` - cover similar ground
- Multiple files describing the same concepts
- Scattered information across many files

### 3. **Docs vs. Reality Gap**
- Detailed API specs that don't match current implementation
- Business workflows for features not yet built
- Auth specs more complex than needed for MVP

### 4. **Missing Practical Guidance**
- No clear "start here" workflow
- Too much theory, not enough "what to do next"
- Implementation details buried in long documents

## Recommended Cleanup

### 🎯 **Immediate Actions (Keep These)**

**Essential Working Documents:**
1. **`CLAUDE.md`** - Main project instructions (keep as-is)
2. **`SCHEDULE_CONTEXT_REQUIREMENTS.md`** - Critical for current work
3. **`MINIMUM_VIABLE_SCHEDULE_PLAN.md`** - Foundation implementation
4. **`frontend/CLAUDE.md`** - Frontend development guide
5. **`frontend/MENU_MIGRATION_STATUS.md`** - Useful tracking document

### 📁 **Consolidate/Simplify**

**Merge Redundant Files:**
- Combine `frontend/ARCHITECTURE.md` + `frontend/SUMMARY.md` → `frontend/DEVELOPMENT_STATUS.md`
- Keep the best parts of both, eliminate overlap

**Simplify Docs Directory:**
- Keep `README.md` and `DATA_MODEL_SIMPLE.md` as reference
- Archive detailed specs until needed for advanced features

### 🗂️ **Archive Detailed Specs**

**Move to `/docs/archive/` or reference only:**
- `API_ENDPOINTS.md` - Too detailed for current needs
- `BUSINESS_WORKFLOWS.md` - Advanced features for later
- `AUTH_SPECS.md` - Over-engineered for MVP
- `PROJECT_STRUCTURE_PLAN.md` - Deployment details for later

## Recommended Final Structure

```
new-app/
├── CLAUDE.md                              # Main instructions (ESSENTIAL)
├── QUICK_START.md                         # New: 1-page getting started
├── SCHEDULE_CONTEXT_REQUIREMENTS.md      # Architecture analysis (ESSENTIAL)  
├── MINIMUM_VIABLE_SCHEDULE_PLAN.md       # Implementation foundation (ESSENTIAL)
├── backend/
│   └── CLAUDE.md                          # Backend development guide
├── frontend/
│   ├── CLAUDE.md                          # Frontend development guide
│   ├── DEVELOPMENT_STATUS.md              # Consolidated architecture + status
│   └── MENU_MIGRATION_STATUS.md           # Migration tracking
└── docs/
    ├── README.md                          # Overview
    ├── DATA_MODEL_REFERENCE.md            # Schema reference (simplified)
    └── archive/                           # Detailed specs for later
        ├── API_ENDPOINTS.md
        ├── BUSINESS_WORKFLOWS.md
        └── AUTH_SPECS.md
```

## New Document Needed: QUICK_START.md

**Content**: Single-page guide with:
1. **Current Status**: What works now
2. **Immediate Next Steps**: What to implement first  
3. **How to Get Started**: Practical commands
4. **Key Files**: Where to find implementation guidance

## Assessment: Docs Directory

### ✅ **Keep as Reference**:
- `DATA_MODEL_SIMPLE.md` - Useful for database questions
- `README.md` - Good overview

### ⚠️ **Archive for Later**:
- `API_ENDPOINTS.md` - Too detailed, premature optimization
- `BUSINESS_WORKFLOWS.md` - Advanced features, not MVP
- `AUTH_SPECS.md` - Over-engineered for current needs  
- `PROJECT_STRUCTURE_PLAN.md` - Deployment concerns for later

### 🎯 **Why Archive These?**
1. **Information Overload**: 1,000+ lines of specs overwhelm developers
2. **Premature Detail**: Detailed API specs for unbuilt features
3. **Analysis Paralysis**: Too much planning, not enough building
4. **Legacy Complexity**: Based on full legacy system, not MVP needs

## Conclusion

**Current docs are too comprehensive for immediate needs.** The team needs:

1. **Clear "what to do next" guidance** (missing)
2. **Essential architecture documents** (we have these)
3. **Reference materials when needed** (keep some, archive others)
4. **Working implementation guides** (we have these)

**Recommendation**: Focus on the 5 essential documents, create a simple QUICK_START.md, and archive the detailed specs until advanced features are needed.

This will reduce cognitive load from **1,500+ lines** to **~800 lines** of focused, actionable documentation.