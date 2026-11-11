---
title: 
date:
tags:
---




>[!math] **Definition:** 设 $X,Y$ 是赋范空间，$T:X\to Y$ 是线性映射，若 $\exists M>0$，使得 $\lVert Tx \rVert\le M\lVert x \rVert$，则称 $T$ 有界，$T\in B(X,Y)$。

>[!math] **Proposition:** 设 $X,Y$ 是赋范空间，$T:X\to Y$ 是线性映射，$T$ 有界与下列条件等价
> - $T$ 在 $x_{0}$ 处连续。
> - $T$ 是连续映射。
> - $T$ 在 $x_{0}$ 某个邻域上有界。
> - $T$ 将有界集映成有界集。

>[!math] **Definition:** 设 $X,Y$ 是赋范空间，定义 $T\in B(X,Y)$ 范数为
>$$
>\lVert T \rVert=\sup_{x\in X} \frac{\lVert Tx \rVert }{\lVert x \rVert } 
>$$
> 即 $B(X,Y)$ 是赋范空间。

---

下面我们讨论 $B(X,Y)$ 的性质。

>[!math] **共鸣定理:** 设 $X,Y$ 是赋范空间，$\{ T_{\lambda} \}\subset B(X,Y)$。若 $\{ T_{\lambda} \}$ 在 $X$ 的第二纲集上逐点有界，则 $\{ T_{\lambda} \}$ 一致有界。

特别地，取 $X$ 为 Banach 空间，$\{ T_{\lambda} \}$ 为一列映射，有：

>[!math] **Banach-Steinhaus:** 设 $X$ 是 Banach 空间，$Y$ 是赋范空间。 $\{ T_{n} \}\subset B(X,Y)$，且 $\{ T_{n} \}$ 逐点收敛于 $T$，则 $T\in B(X,Y)$，且
>$$
>\lVert T \rVert\le \liminf_{ n \to \infty }  \lVert T_{n} \rVert 
>$$

>[!math] **开映射定理:** 设 $X$ 是 Banach 空间，$Y$ 是赋范空间，$T\in B(X,Y)$ 且 $\mathrm{im} T$ 是 $Y$ 的第二纲集，则 $T$ 是开映射且满射。特别地，$X,Y$ 是 Banach 空间，$T\in B(X,Y)$ 满射，则 $T$ 是开映射。


>[!math] **Definition:** 设 $X,Y$ 是 Banach 空间，$X\times Y$ 赋予 $\lVert (x,y) \rVert=\lVert x \rVert+\lVert y \rVert$，$T:X\to Y$ 为映射，定义
>$$
>G(T)=\{ (x,Tx): x\in X\}
>$$
>为 T 的 Graph。若 $G(T)$ 是闭集，则称 $T$ 是闭图像映射。

>[!math] **闭图像定理:** 设 $X,Y$ 是 Banach 空间，$T\in L(X,y)$，若 $T$ 是闭图像映射，则 $T$ 连续。

>[!math] **Hahn-Banach:** 设 $X$ 是实线性空间，$p:X\to \mathbb{R}$ 是次线性泛函，$E\subset X$ 是线性子空间，$f_{0}:E\to \mathbb{R}$ 是 $E$ 上线性泛函，且在 $E$ 上 $f_{0}\le p$，则 $\exists f:X\to \mathbb{R}$ 满足：
>$$
>f|_{E}=f_{0},\qquad f(x)\le p(x) \quad\forall x\in X
>$$ 

>[!math] **Hahn-Banach:** 设 $X$ 是复线性空间，$p:X\to \mathbb{R}$ 是次线性泛函，$E\subset X$ 是线性子空间，$f_{0}:E\to \mathbb{C}$ 是 $E$ 上线性泛函，且在 $E$ 上 $\mathrm{\mathrm{Re}}f_{0}\le p$，则 $\exists f:X\to \mathbb{R}$ 满足：
>$$
>f|_{E}=f_{0},\qquad \mathrm{Re}f (x)\le p(x) \quad\forall x\in X
>$$ 
>特别地，若 $p$ 是半范数，$|f_{0}|\le p$，则 $|f|\le p$。

>[!math] **保泛延拓:** 设 $X$ 是赋范空间，$E$ 是线性子空间，$f_{0}$ 是 $E$ 上有界线性泛函，则 $\exists f$ 为 $X$ 上有界线性泛函，满足
>$$
>f|_{E}=f_{0},\lVert f \rVert =\lVert f_{0} \rVert 
>$$




