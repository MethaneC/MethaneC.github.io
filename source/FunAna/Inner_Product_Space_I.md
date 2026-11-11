---
title: 
date:
tags:
---

>[!math] **Defintion:** 设 $X$ 是线性空间，$\langle \cdot, \cdot \rangle:X\times X\to \mathbb{R}$ 满足
>1. $\langle x,y\rangle=\overline{\langle y,x\rangle}$
>2. $\langle \alpha x,y\rangle=\alpha\langle x,y\rangle$
>3. $\langle x+y,z\rangle=\langle x,z\rangle+\langle y,z\rangle$
>4. $\forall x\in X$，$\langle x,x\rangle\ge 0$，当且仅当 $x=0$ 取等。
>
> 则称 $X$ 是内积空间。令 $\lVert x \rVert=\sqrt{ \langle x,x\rangle }$，则 $X$ 是赋范空间。

>[!math] **Proposition:** 设 $X$ 是内积空间，则
> 1. $|\langle x,y\rangle|\le \lVert x \rVert \lVert y \rVert$。
> 2. $\langle\cdot,\cdot\rangle:X\times X\to \mathbb{R}$ 是二元连续函数。 

内积空间可视为特殊的赋范空间，下面指出赋范空间称为内积的充要条件。

>[!math] **Proposition:** 设 $X$ 是赋范空间，则 $X$ 是内积空间，当且仅当平行四边形公式成立，即
>$$
>\lVert x+y \rVert^{2}+\lVert x-y \rVert^{2}=2(\lVert x \rVert^{2}+\lVert y \rVert^{2}  )  
>$$
> 此时内积定义为
> $$
> \langle x,y\rangle=\frac{1}{4}(\lVert x+y\rVert^{2}-\lVert x-y \rVert^{2}+i\lVert x+iy \rVert^{2}-i\lVert x-iy \rVert^{2})
> $$
> 特别地，若 $X$ 是实空间，
> $$
> \langle x,y\rangle=\frac{1}{4}(\lVert x+y\rVert^{2}-\lVert x-y \rVert^{2})
> $$

>[!math] **Definition:** 设 $X$ 是内积空间，定义
> 1. 设 $x,y\in X$，若 $\langle x,y\rangle=0$，则称 $x,y$ 正交，记作 $x\perp y$。
> 2. 设 $M,N$ 是子空间，$\forall x\in M,y\in N$，$x\perp y$，则称 $M$ 和 $N$ 正交，$M\perp N$。
> 3. 设 $M$ 是子空间，定义正交补为 $M^{\perp}=\{ x\in X:x\perp M \}$。
> 4. 若 $E\subset X$，$\forall x,y\in E$ 且 $x\ne y$，$x\perp y$，则称 $E$ 是正交集。
> 5. 若 $E\subset X$，$\forall x\in E$，$\lVert x \rVert=1$，则称 $E$ 是规范集。

>[!math] **Proposition:** 设 $E\subset X$ 是规范正交集，$\forall x\in X$ 则
> 1. 对于 $e_{\lambda}\in E$，至多可列个 $\langle x,e_{\lambda}\rangle$ 非零。
> 2. Bessel 不等式成立。
> $$
> \lVert x \rVert^{2}\ge \sum_{\lambda} |\langle x,e_{\lambda}\rangle|^{2}
> $$
> 
> 此时记非零 $\langle x,e_{\lambda}\rangle$ 为 Fourier 系数。 $\sum \langle x,e_{\lambda}\rangle e_{\lambda}$ 为 Fourier 级数。

由于 Fourier 级数可列元非零，我们可以讨论其极限。一个基本问题是 $x$ 的 Fourier 级数是否收敛于 $x$。

>[!math] **Theorem:** 设 $E\subset X$ 是规范正交集，$x\in X$，则以下条件等价。
> 1. $x\in \overline{\mathrm{span}E}$
> 2. Fourier 级数收敛，即
> $$
> x=\sum_{\lambda} \langle x,e_{\lambda}\rangle 
> $$
> 3. Parseval 恒等式成立
> $$
> \lVert x \rVert^{2}=\sum_{\lambda} |\langle x,e_{\lambda}\rangle|^{2}
> $$

接下来我们考虑完备内积空间。

>[!math] **Definition:** 设 $X$ 是内积空间，若 $X$ 完备，则称 $X$ 是 Hilbert 空间。

>[!math] **Riesz-Fischer:** 设 $X$ 是 Hilbert 空间，$E\subset X$ 是规范正交集，则对于数列 $\{ \alpha_{n} \}\subset F$ 满足 
> $$
> \sum_{n=1}^{\infty} |\alpha_{n}|^{2}<\infty
> $$
> 则 $\exists x\in \overline{\mathrm{span}E}$，使得 $x=\sum_{n=1}^{\infty}\alpha_{n}e_{n}$，且 $\langle x,e_{n}\rangle=\alpha_{n}$。

>[!math] **Hilbert 正交分解定理:** 设 $X$ 是 Hilbert 空间，$E\subset X$ 是线性子空间，则正交分解
>$$
>X=E\oplus E^{\perp}
>$$
>成立当且仅当 $E$ 是闭线性子空间。

Hilbert 空间 Fourier 级数相关结论可以增强。

>[!math] **Theorem:** 设 $X$ 是 Hilbert 空间， $E$ 是规范正交集，则下列条件等价
>1. $E$ 是极大规范正交集。
>2. $E^{\perp}=\{ 0 \}$。
>3. $\overline{\mathrm{span}E}=X$。
>4. $\forall x\in X$，Fourier 级数收敛。
>5. $\forall x\in X$，Parseval 等式成立。
>6. $\forall x,y\in X$，有
>$$
> \langle x,y\rangle=\sum_{\lambda} \langle x,e_{\lambda}\rangle \overline{\langle y,e_{\lambda}\rangle}
>$$

---

下面我们考虑 Hilbert 空间上的映射。

Hilbert 空间的有界线性泛函非常简单。

>[!math] **Riesz 表示定理:** 设 $X$ 是 Hilbert 空间，$f:X\to \mathbb{R}$ 是有界线性泛函，则 $\exists y\in X$，使得
>$$
>f(x)=\langle x ,y\rangle
>$$
>且 $\lVert f \rVert=\lVert y \rVert$。