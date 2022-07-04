# Maths

This directory contains useful programs for maths-based activities.

# `Complex.ts`
**About**: Represent a complex number

**Dependencies**: *None*

# `constants.ts`
**About**: Export a few useful mathematical constants

**Dependencies**: *None*

# `exponential-integral.ts`
**About**: Define several Exponential Integral functions

**Dependencies**: `constants.ts`

# `Expression.ts`
**About**: A class for parsing and evaluating numerical expressions

**Dependencies**: `../utils::parseNumber`

# `gamma.ts`
**About**: Approximation of the gamma function (complex argument)

**Dependencies**: `Complex.ts`, `constants.ts`

# `lambertw.ts`
**About**: Return function such that `W(x*e**x) = x`

**Dependencies**: `Complex.ts`, `constants.ts`

# `polynomial.ts`
**About**: Class of functions to solve or produce polynomials

**Dependencies**: `Complex.ts`, `constants.ts`

# `Matrix.ts`
**About**: Represent a matrix of complex numbers

**Dependencies**: `Complex.ts`

# `wright-omega.ts`
**About**: Return function `ω(z)` such that `w + log(w) = z`

**Dependencies**: `Complex.ts`, `constants.ts`