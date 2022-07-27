# Maths

This directory contains useful programs for maths-based activities.

# `bernoulli.ts`
**About**: Functions for obtaining the `n`th Bernoulli number

**Dependencies**: *None*

# `catalan-beta.ts`
**About**: Functions for evaluating the Catalan Beta function, β

**Dependencies**: `gamma.ts`

# `chebyshev-polynomials.ts`
**About**: Functions for evaluating Chebyshev Polynomial functions: first (T), second (U), third (V), and fourth (W), including their shifted counterparts

**Dependencies**: *None*

# `Complex.ts`
**About**: Represent a complex number

**Dependencies**: *None*

# `constants.ts`
**About**: Export a few useful mathematical constants

**Dependencies**: *None*

# `dawson-integral.ts`
**About**: Function for evaluating the Dawson integral, Daw(x)

**Dependencies**: `chebyshev-polynomials.ts`

# `dirichlet-eta.ts`
**About**: Functions for evaluating the Dirichlet Eta function, η

**Dependencies**: `gamma.ts`

# `dirichlet-lambda.ts`
**About**: Functions for evaluating the Dirichlet Lambda function, λ

**Dependencies**: `riemann-zeta.ts`


# `error-function.ts`
**About**: Functions for approximating the error function, erf(x), and related functions

**Dependencies**: `Complex.ts`

# `elliptic-integrals.ts`
**About**: Functions for evaluating Elliptic integrals e.g. `\int sqrt(1 - k^2 sin^2(t)) dt`

**Dependencies**: *None*

# `exponential-integral.ts`
**About**: Define several Exponential Integral functions

**Dependencies**: `constants.ts`

# `fresnel-sin-cos-integrals.ts`
**About**: unctions for evaluating various Fresnel sine and cosine integrals e.g. `S(x)`, `g(x)`

**Dependencies**: `chebyshev-polynomials.ts`

# `gamma.ts`
**About**: Approximation of the gamma function (real argument)

**Dependencies**: *None*

# `gaussian.ts`
**About**: Calculate the Gaussian function, and related functions

**Dependencies**: *None*

# `general.ts`
**About**: Collection of un-classified maths functions

**Dependencies**: `polynomial.ts`

# `lambertw.ts`
**About**: Return function such that `W(x*e**x) = x`

**Dependencies**: `Complex.ts`, `constants.ts`

# `polynomial.ts`
**About**: Class of functions to solve, produce and manipulate polynomials

**Dependencies**: `Complex.ts`, `constants.ts`

# `recurrence-relations.ts`
**About**: Various common recurrence relations functions

**Dependencies**: `polynomial.ts`

# `riemann-zeta.ts`
**About**: Functions for evaluating the Riemann Zeta function, ζ

**Dependencies**: `bernoulli.ts`

# `sin-cos-integrals.ts`
**About**: Functions for evaluating various sine and cosine integrals e.g. `Si(x)`, `gi(x)`

**Dependencies**: *None*

# `Matrix.ts`
**About**: Represent a matrix

**Dependencies**: *None*

# `Matrix-Complex.ts`
**About**: Represent a matrix of complex numbers

**Dependencies**: `Complex.ts`

# `wright-omega.ts`
**About**: Return function `ω(z)` such that `w + log(w) = z`

**Dependencies**: `Complex.ts`, `constants.ts`

# `zgamma.ts`
**About**: Approximation of the gamma function (complex argument)

**Dependencies**: `Complex.ts`