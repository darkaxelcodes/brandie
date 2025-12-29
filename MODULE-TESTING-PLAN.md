# Module Testing Plan - Systematic QA

## Testing Methodology

For each module, we will test:
- ✅ **UI/Visual**: Layout, responsiveness, styling, accessibility
- ✅ **UX/Flow**: User journey, navigation, feedback, error states
- ✅ **Functionality**: All buttons, forms, actions work as intended
- ✅ **Logic**: Business logic, calculations, data processing
- ✅ **Integration**: API calls, database operations, external services
- ✅ **Error Handling**: Edge cases, validation, error messages
- ✅ **Performance**: Loading states, optimization, responsiveness

---

## Module Priority Order

### Phase 1: Core User Journey (Critical Path)
1. Authentication & Onboarding
2. Dashboard & Navigation
3. Brand Strategy (Core workflow)
4. Visual Identity (Core workflow)
5. Brand Voice (Core workflow)

### Phase 2: Supporting Features
6. Brand Consistency
7. Brand Guidelines
8. Brand Health
9. Assets Management
10. Token & Subscription System

### Phase 3: Advanced Features
11. Landing Page Generator
12. Chat Assistant
13. Teams Management

### Phase 4: Public Pages
14. Landing/Marketing Pages
15. User Preferences

---

## Module 1: Authentication & Onboarding

### Components to Test
- `src/pages/Auth.tsx`
- `src/components/onboarding/OnboardingFlow.tsx`
- `src/components/onboarding/ProfileCompletionBanner.tsx`
- `src/contexts/AuthContext.tsx`

### Test Cases

#### 1.1 Sign Up Flow
- [ ] Sign up form displays correctly
- [ ] Email validation works
- [ ] Password validation works (min length, requirements)
- [ ] Sign up button submits form
- [ ] Loading state shows during sign up
- [ ] Success: redirects to dashboard or onboarding
- [ ] Error: shows clear error message
- [ ] Duplicate email: shows appropriate error

#### 1.2 Sign In Flow
- [ ] Sign in form displays correctly
- [ ] Email and password fields work
- [ ] Sign in button submits form
- [ ] Loading state shows during sign in
- [ ] Success: redirects to intended page or dashboard
- [ ] Error: shows clear error message
- [ ] Invalid credentials: shows appropriate error
- [ ] Session persists after page refresh

#### 1.3 Sign Out Flow
- [ ] Sign out button accessible from sidebar/header
- [ ] Sign out clears session
- [ ] Redirects to landing/auth page
- [ ] Protected routes become inaccessible

#### 1.4 Onboarding Flow
- [ ] Onboarding shows for new users
- [ ] Step 1 (Welcome): displays correctly
- [ ] Step 2 (Role): role selection works
- [ ] Step 3 (Goals): goal selection works
- [ ] Step 4 (Experience): experience level selection works
- [ ] Progress indicator shows correct step
- [ ] Next/Back buttons work correctly
- [ ] Skip button works (with confirmation)
- [ ] Complete button saves data to database
- [ ] Profile completion banner shows when incomplete
- [ ] Can dismiss onboarding and resume later

#### 1.5 Protected Routes
- [ ] Unauthenticated users redirected to auth
- [ ] Authenticated users can access protected pages
- [ ] Redirect preserves intended destination
- [ ] Session check happens on mount

---

## Module 2: Dashboard & Navigation

### Components to Test
- `src/pages/Dashboard.tsx`
- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Navbar.tsx`

### Test Cases

#### 2.1 Dashboard Overview
- [ ] Dashboard loads without errors
- [ ] Shows correct user name/email
- [ ] Displays brand count correctly
- [ ] Shows token balance
- [ ] Shows subscription status
- [ ] Brand cards render correctly
- [ ] Empty state shows when no brands
- [ ] Loading state shows while fetching data
- [ ] Error state shows on failure

#### 2.2 Brand Management
- [ ] "Create New Brand" button works
- [ ] Brand creation modal opens
- [ ] Can enter brand name
- [ ] Can create brand successfully
- [ ] New brand appears in list
- [ ] Can select/switch between brands
- [ ] Can edit brand (if feature exists)
- [ ] Can archive brand
- [ ] Can delete brand (with confirmation)
- [ ] Archived brands section works

#### 2.3 Brand Progress Display
- [ ] Progress percentage calculated correctly
- [ ] Progress bar reflects completion
- [ ] Individual section progress shown
- [ ] Progress updates after completing sections

#### 2.4 Navigation - Sidebar
- [ ] Sidebar opens/closes on mobile
- [ ] All navigation links present
- [ ] Active page highlighted correctly
- [ ] Links navigate to correct pages
- [ ] Icons display correctly
- [ ] User profile section shows
- [ ] Sign out button accessible

#### 2.5 Navigation - Header
- [ ] Header shows on all pages
- [ ] Brand selector works (if present)
- [ ] Breadcrumbs show correctly (if present)
- [ ] Token display shows current balance
- [ ] Settings/profile accessible

#### 2.6 Responsive Design
- [ ] Mobile view: hamburger menu works
- [ ] Tablet view: layout adapts correctly
- [ ] Desktop view: full sidebar visible
- [ ] All breakpoints tested

---

## Module 3: Brand Strategy

### Components to Test
- `src/pages/strategy/BrandStrategy.tsx`
- `src/pages/strategy/steps/PurposeStep.tsx`
- `src/pages/strategy/steps/AudienceStep.tsx`
- `src/pages/strategy/steps/ValuesStep.tsx`
- `src/pages/strategy/steps/ArchetypeStep.tsx`
- `src/pages/strategy/steps/CompetitiveStep.tsx`
- `src/components/strategy/*`

### Test Cases

#### 3.1 Strategy Navigation
- [ ] Strategy page loads correctly
- [ ] Step indicator shows all 5 steps
- [ ] Current step highlighted
- [ ] Can navigate between steps
- [ ] Progress saved when switching steps
- [ ] Back button works
- [ ] Next button works
- [ ] Save draft button works

#### 3.2 Step 1: Purpose
- [ ] Purpose input field displays
- [ ] Can enter brand purpose
- [ ] Character count/limit shown (if any)
- [ ] AI suggestion button works
- [ ] AI analysis uses tokens
- [ ] Token deduction shows
- [ ] AI suggestions display correctly
- [ ] Can apply AI suggestions
- [ ] Save button works
- [ ] Data persists to database
- [ ] Validation shows errors

#### 3.3 Step 2: Target Audience
- [ ] Audience form displays
- [ ] Can select demographics
- [ ] Can add multiple audience segments
- [ ] Can remove audience segments
- [ ] Psychographics fields work
- [ ] Pain points section works
- [ ] AI audience analysis works
- [ ] Save button persists data
- [ ] Validation works correctly

#### 3.4 Step 3: Brand Values
- [ ] Values input displays
- [ ] Can add multiple values
- [ ] Can edit values
- [ ] Can remove values
- [ ] Reordering values works (if feature exists)
- [ ] AI values suggestion works
- [ ] Save button persists data
- [ ] Validation requires minimum values

#### 3.5 Step 4: Brand Archetype
- [ ] All 12 archetypes display
- [ ] Archetype cards show name, description, icon
- [ ] Can select archetype
- [ ] Selection shows visually
- [ ] Can change archetype selection
- [ ] AI archetype suggestion works
- [ ] Reasoning shown for AI suggestion
- [ ] Save button persists selection
- [ ] Can proceed without AI assistance

#### 3.6 Step 5: Competitive Analysis
- [ ] Industry selector displays
- [ ] Can select industry
- [ ] Competitors list shows (if available)
- [ ] Can add custom competitors
- [ ] Can analyze competitors
- [ ] AI analysis works
- [ ] Analysis results display correctly
- [ ] Differentiation suggestions shown
- [ ] Save button persists data

#### 3.7 Strategy Completion
- [ ] Complete button available when all steps done
- [ ] Completion saves all data
- [ ] Redirects to next section (Visual Identity)
- [ ] Progress updates in dashboard
- [ ] Can return to edit strategy later

---

## Module 4: Visual Identity

### Components to Test
- `src/pages/visual/VisualIdentity.tsx`
- `src/components/visual/ColorPaletteGenerator.tsx`
- `src/components/visual/AIColorPaletteGenerator.tsx`
- `src/components/visual/LogoGenerator.tsx`
- `src/components/visual/AILogoGenerator.tsx`
- `src/components/visual/TypographyPreview.tsx`
- `src/components/visual/AITypographyGenerator.tsx`

### Test Cases

#### 4.1 Visual Identity Navigation
- [ ] Visual identity page loads
- [ ] Tab navigation works (Colors, Logo, Typography)
- [ ] Active tab highlighted
- [ ] Tab content switches correctly
- [ ] Can save and continue to next section

#### 4.2 Color Palette - Manual
- [ ] Color palette generator displays
- [ ] Can select base color
- [ ] Color picker works
- [ ] Generates color harmonies
- [ ] Shows complementary, analogous, triadic, etc.
- [ ] Can select harmony type
- [ ] Preview shows all colors
- [ ] Hex codes displayed correctly
- [ ] Can copy hex codes to clipboard
- [ ] Clipboard copy shows feedback
- [ ] Export options work (CSS, SCSS, JSON)
- [ ] Accessibility check shows contrast ratios
- [ ] WCAG compliance displayed
- [ ] Save palette persists to database

#### 4.3 Color Palette - AI
- [ ] AI palette button shows
- [ ] Prompts for brand context (if needed)
- [ ] Uses tokens for generation
- [ ] Shows loading state
- [ ] Generates multiple palette options
- [ ] Can select from AI suggestions
- [ ] Can regenerate palettes
- [ ] Applied palette saves correctly
- [ ] Error handling for AI failures

#### 4.4 Logo Generator - Manual
- [ ] Logo upload section displays
- [ ] Can upload image file
- [ ] File type validation works
- [ ] File size validation works
- [ ] Preview shows uploaded logo
- [ ] Can clear/remove logo
- [ ] Save uploads to storage
- [ ] Logo accessible in guidelines

#### 4.5 Logo Generator - AI
- [ ] AI logo generator displays
- [ ] Can enter logo prompt
- [ ] Style selection works
- [ ] Color preference selection works
- [ ] Uses tokens for generation
- [ ] Shows loading state
- [ ] Generates multiple logo concepts
- [ ] Logos display correctly (no XSS)
- [ ] Can select logo
- [ ] Can regenerate logos
- [ ] Can download logo (SVG, PNG)
- [ ] Download works correctly
- [ ] Selected logo saves to database
- [ ] No memory leaks from blob URLs

#### 4.6 Typography
- [ ] Typography preview displays
- [ ] Font family selectors work
- [ ] Primary font selection works
- [ ] Secondary font selection works
- [ ] Font previews render correctly
- [ ] Font size scale shown
- [ ] Can customize font weights
- [ ] AI typography suggestion works
- [ ] Font pairing recommendations shown
- [ ] Save typography settings persists data

---

## Module 5: Brand Voice

### Components to Test
- `src/pages/voice/BrandVoice.tsx`
- `src/components/voice/AIPilotVoice.tsx`
- `src/components/voice/AIVoiceGenerator.tsx`
- `src/components/voice/VoiceExamples.tsx`
- `src/components/voice/PlatformContentGenerator.tsx`

### Test Cases

#### 5.1 Voice Definition
- [ ] Brand voice page loads
- [ ] Voice attributes display
- [ ] Can define tone (formal/casual, etc.)
- [ ] Can set voice personality traits
- [ ] Voice spectrum sliders work
- [ ] Can add dos and don'ts
- [ ] AI voice analysis works
- [ ] AI suggestions based on strategy
- [ ] Save voice definition persists

#### 5.2 Voice Examples
- [ ] Example section displays
- [ ] Shows before/after examples
- [ ] Examples align with voice definition
- [ ] Can generate custom examples
- [ ] Examples cover different contexts
- [ ] Can regenerate examples

#### 5.3 Platform Content Generator
- [ ] Platform selector displays
- [ ] Can select platform (Twitter, LinkedIn, etc.)
- [ ] Can enter content prompt
- [ ] AI generates platform-specific content
- [ ] Uses tokens correctly
- [ ] Content matches brand voice
- [ ] Can copy generated content
- [ ] Can regenerate content
- [ ] Multiple variations shown

#### 5.4 Voice Audio (if implemented)
- [ ] Text-to-speech section displays
- [ ] Can generate voice sample
- [ ] Audio plays correctly
- [ ] Voice matches brand personality
- [ ] Can download audio
- [ ] ElevenLabs integration works

---

## Module 6: Brand Consistency

### Components to Test
- `src/pages/consistency/BrandConsistency.tsx`
- `src/components/consistency/BrandComplianceChecker.tsx`
- `src/components/consistency/TemplateLibrary.tsx`
- `src/components/consistency/MarketingTemplates.tsx`
- `src/components/consistency/SocialMediaTemplates.tsx`

### Test Cases

#### 6.1 Compliance Checker
- [ ] Compliance checker displays
- [ ] Can paste/upload content
- [ ] Analysis button works
- [ ] Uses tokens for analysis
- [ ] Shows compliance score
- [ ] Highlights issues
- [ ] Provides suggestions
- [ ] Can apply suggestions
- [ ] Re-check works

#### 6.2 Template Library
- [ ] Template library displays
- [ ] Categories shown (Social, Email, etc.)
- [ ] Templates render correctly
- [ ] Can filter templates
- [ ] Can search templates
- [ ] Template preview works
- [ ] Can select template
- [ ] Template applies brand guidelines

#### 6.3 Marketing Templates
- [ ] Marketing template section displays
- [ ] Different template types shown
- [ ] Can customize template
- [ ] Brand elements auto-fill
- [ ] Can export template
- [ ] Export formats work (PDF, PNG, etc.)

#### 6.4 Social Media Templates
- [ ] Social media templates display
- [ ] Platform-specific templates (IG, FB, Twitter)
- [ ] Correct dimensions for each platform
- [ ] Brand colors applied
- [ ] Brand fonts applied
- [ ] Can edit content
- [ ] Can download/export

---

## Module 7: Brand Guidelines

### Components to Test
- `src/pages/guidelines/BrandGuidelines.tsx`
- `src/components/guidelines/AIGuidelinesGenerator.tsx`
- `src/components/guidelines/GuidelinesPreview.tsx`
- `src/components/guidelines/GuidelinesExport.tsx`
- `src/components/guidelines/AssetExportManager.tsx`

### Test Cases

#### 7.1 Guidelines Generation
- [ ] Guidelines page loads
- [ ] Shows all brand sections
- [ ] Strategy section populated
- [ ] Visual identity section populated
- [ ] Voice section populated
- [ ] All data displayed correctly
- [ ] Can edit inline (if feature exists)
- [ ] AI enhancement button works
- [ ] AI improves descriptions
- [ ] Uses tokens for AI features

#### 7.2 Guidelines Preview
- [ ] Preview mode displays
- [ ] All sections formatted correctly
- [ ] Colors displayed properly
- [ ] Logo shows correctly
- [ ] Typography examples shown
- [ ] Voice examples included
- [ ] Navigation between sections works
- [ ] Print-friendly layout

#### 7.3 Guidelines Export
- [ ] Export button displays
- [ ] Export format options shown (PDF, etc.)
- [ ] PDF export works
- [ ] PDF contains all sections
- [ ] PDF formatting correct
- [ ] Images embedded properly
- [ ] Download triggers correctly
- [ ] File named appropriately

#### 7.4 Asset Export Manager
- [ ] Asset export section displays
- [ ] Lists all brand assets
- [ ] Can select individual assets
- [ ] Can select all assets
- [ ] Bulk download works
- [ ] ZIP file created correctly
- [ ] All files included in export

---

## Module 8: Supporting Modules

### 8.1 Brand Health
**Components**: `src/pages/BrandHealth.tsx`, `src/components/strategy/BrandHealthScore.tsx`

Test Cases:
- [ ] Health page loads
- [ ] Health score calculated correctly
- [ ] Score breakdown shown
- [ ] Recommendations displayed
- [ ] Can track health over time
- [ ] Charts/visualizations work

### 8.2 Assets Management
**Components**: `src/pages/Assets.tsx`

Test Cases:
- [ ] Assets page loads
- [ ] Lists all brand assets
- [ ] Can upload new assets
- [ ] Can organize into folders/categories
- [ ] Can search assets
- [ ] Can preview assets
- [ ] Can download assets
- [ ] Can delete assets
- [ ] File type validation works
- [ ] Storage limits enforced

### 8.3 Teams Management
**Components**: `src/pages/Teams.tsx`

Test Cases:
- [ ] Teams page loads
- [ ] Shows current team members
- [ ] Can invite team members
- [ ] Email invitations sent
- [ ] Can set member roles
- [ ] Role permissions work
- [ ] Can remove team members
- [ ] Team member actions logged

---

## Module 9: Landing Page Generator

### Components to Test
- `src/pages/LandingPageGenerator.tsx`

### Test Cases

#### 9.1 Landing Page Creation
- [ ] Landing page generator loads
- [ ] Can enter page details
- [ ] Prompt input works
- [ ] AI generates HTML/CSS
- [ ] Uses tokens for generation
- [ ] Preview displays correctly (no XSS)
- [ ] Iframe sandboxed properly
- [ ] Can edit generated code
- [ ] Can regenerate page
- [ ] Multiple style options

#### 9.2 Landing Page Export
- [ ] Export button works
- [ ] Can export as HTML file
- [ ] HTML includes all assets
- [ ] CSS embedded/linked correctly
- [ ] Images handled properly
- [ ] Code is clean and valid
- [ ] Download triggers correctly

---

## Module 10: Chat Assistant

### Components to Test
- `src/pages/ChatAssistant.tsx`
- `src/components/chat/ChatBot.tsx`
- `src/components/chat/ChatBubble.tsx`
- `src/components/chat/ConversationHistory.tsx`
- `src/components/chat/VoiceChat.tsx`

### Test Cases

#### 10.1 Chat Interface
- [ ] Chat page loads
- [ ] Chat history displays
- [ ] Message input field works
- [ ] Send button works
- [ ] Enter key sends message
- [ ] Loading state shows while waiting
- [ ] AI response displays correctly
- [ ] Markdown rendering works
- [ ] Code blocks formatted properly
- [ ] Messages persist in history

#### 10.2 Chat Functionality
- [ ] AI provides brand guidance
- [ ] Context aware of brand data
- [ ] Can ask about brand strategy
- [ ] Can ask about visual identity
- [ ] Can generate content
- [ ] Uses tokens per message
- [ ] Token balance updates
- [ ] Error handling for API failures

#### 10.3 Conversation Management
- [ ] Can start new conversation
- [ ] Can switch between conversations
- [ ] Conversation history loads
- [ ] Can delete conversations
- [ ] Can search conversations

#### 10.4 Voice Chat (if implemented)
- [ ] Voice input button shows
- [ ] Microphone permission requested
- [ ] Voice recording works
- [ ] Speech-to-text works
- [ ] Text-to-speech works
- [ ] Voice playback works

---

## Module 11: Token & Subscription System

### Components to Test
- `src/pages/TokenPurchase.tsx`
- `src/pages/TokenHistory.tsx`
- `src/components/tokens/TokenDisplay.tsx`
- `src/components/tokens/TokenActionButton.tsx`
- `src/components/tokens/TokenUsageModal.tsx`
- `src/components/subscription/SubscriptionStatus.tsx`
- `src/components/subscription/PricingCard.tsx`

### Test Cases

#### 11.1 Token Display
- [ ] Token balance shows correctly everywhere
- [ ] Updates in real-time after use
- [ ] Badge displays on pages
- [ ] Click opens token details

#### 11.2 Token Purchase
- [ ] Token purchase page loads
- [ ] Pricing tiers display
- [ ] Can select tier
- [ ] Stripe checkout redirects (if Stripe configured)
- [ ] Payment flow works
- [ ] Tokens added after payment
- [ ] Success page shows
- [ ] Email confirmation sent

#### 11.3 Token Usage
- [ ] Tokens deducted for AI features
- [ ] Atomic operations prevent race conditions
- [ ] Insufficient balance shows error
- [ ] Can't use features without tokens
- [ ] Token action button shows cost
- [ ] Confirmation modal shows cost

#### 11.4 Token History
- [ ] History page loads
- [ ] Lists all transactions
- [ ] Shows usage details
- [ ] Shows purchase details
- [ ] Pagination works
- [ ] Filter/search works
- [ ] Export history works

#### 11.5 Subscription Status
- [ ] Subscription status displays correctly
- [ ] Shows current plan
- [ ] Shows renewal date
- [ ] Can upgrade plan
- [ ] Can cancel subscription
- [ ] Benefits listed correctly

---

## Module 12: User Preferences

### Components to Test
- `src/pages/UserPreferences.tsx`

### Test Cases

#### 12.1 Profile Settings
- [ ] Preferences page loads
- [ ] Shows current user info
- [ ] Can update name
- [ ] Can update email
- [ ] Email verification required
- [ ] Can change password
- [ ] Password requirements enforced
- [ ] Save button persists changes
- [ ] Success message shows

#### 12.2 Notification Settings
- [ ] Notification toggles work
- [ ] Email notifications setting
- [ ] Push notifications setting (if implemented)
- [ ] Settings persist
- [ ] Changes saved to database

#### 12.3 Appearance Settings
- [ ] Theme toggle works (light/dark)
- [ ] Theme persists across sessions
- [ ] Language selector (if implemented)
- [ ] Accessibility options

#### 12.4 Account Management
- [ ] Can view account created date
- [ ] Can view subscription details
- [ ] Can delete account (with confirmation)
- [ ] Data export option
- [ ] Privacy settings

---

## Module 13: Public Pages

### Components to Test
- `src/pages/Landing.tsx`
- `src/pages/Home.tsx`
- `src/pages/Features.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/ForStartups.tsx`
- `src/pages/ForAgencies.tsx`

### Test Cases

#### 13.1 Landing Page
- [ ] Landing page loads quickly
- [ ] Hero section displays
- [ ] CTA buttons work
- [ ] Animations smooth
- [ ] Responsive design works
- [ ] Images load correctly
- [ ] Links navigate correctly

#### 13.2 Features Page
- [ ] Features page loads
- [ ] All features listed
- [ ] Feature descriptions clear
- [ ] Icons/images display
- [ ] CTA to sign up works

#### 13.3 Pricing Page
- [ ] Pricing page loads
- [ ] All plans displayed
- [ ] Pricing clear and accurate
- [ ] Feature comparison works
- [ ] CTA buttons work
- [ ] Stripe integration works

#### 13.4 Use Case Pages
- [ ] Startups page loads correctly
- [ ] Agencies page loads correctly
- [ ] Content relevant to audience
- [ ] CTAs appropriate

---

## Testing Standards

### For Each Test:
1. **PASS** ✅ - Feature works as expected
2. **FAIL** ❌ - Feature broken or not working
3. **PARTIAL** ⚠️ - Works but has issues
4. **N/A** - Feature not implemented
5. **BLOCKED** 🚫 - Cannot test (dependency)

### Documentation Format:
```
## Module: [Name]
### Test: [Test Name]
**Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL / N/A / 🚫 BLOCKED
**Details**: [What works, what doesn't]
**Screenshots**: [If applicable]
**Reproduction Steps**: [If failed]
**Expected**: [Expected behavior]
**Actual**: [Actual behavior]
**Priority**: Critical / High / Medium / Low
```

---

## Execution Plan

### Step 1: Setup Testing Environment
- [ ] Fresh database state
- [ ] Test user account created
- [ ] Tokens allocated for testing
- [ ] Clear browser cache
- [ ] Network tab open for monitoring

### Step 2: Execute Tests Module by Module
- [ ] Follow priority order
- [ ] Document findings in real-time
- [ ] Take screenshots of issues
- [ ] Note reproduction steps
- [ ] Record expected vs actual behavior

### Step 3: Create Bug Report
- [ ] Compile all failures
- [ ] Prioritize by severity
- [ ] Group related issues
- [ ] Estimate fix effort
- [ ] Create fix plan

### Step 4: Fix and Re-test
- [ ] Fix critical issues first
- [ ] Test after each fix
- [ ] Regression test related features
- [ ] Update documentation

---

## Next Steps

Ready to begin systematic testing. Start with Module 1 (Authentication & Onboarding)?
