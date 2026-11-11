---
title: 
date:
tags:
---

>[!math] **Defintion:** 设 $X$ 是 $F$ 线性空间，其上函数 $p:X\to \mathbb{F}$ 满足
>1. $p(x)\geq 0$，当且仅当 $x=0$ 取等。
>2. $p(\alpha x)=|\alpha| p(x)$
>3. $p(x+y)\le p(x)+p(y)$
>
>则称 $p$ 是 $X$ 上范数，记作 $\lVert x \rVert=p(x)$。令 $d(x,y)=\lVert x-y \rVert$，$X$ 也是度量空间。称 $(X,\lVert \cdot \rVert)$ 是赋范空间。

这里讨论的 $F$ 需要有拓扑性质，这门课只讨论 $\mathbb{R}$ 或 $\mathbb{C}$。

>[!math] **Proposition:** 设 $X$ 是赋范空间，则
>- 范数 $\lVert \cdot \rVert$ 是连续函数。
>- $+:X\times X\to X$ 是连续映射，且 $T_{p}:x\to x+p$ 是同胚。
>- $\cdot:F\times X\to X$ 是连续映射，且 $T_{k}:x\to kx$ 是同胚。

赋范空间是一类特殊的度量空间，下面给出度量空间称为赋范空间的条件。

>[!math] **Thereom:** 设 $X$ 是线性空间且是度量空间，$d$ 是范数诱导当且仅当 
>1. $d(\alpha x,0)=|\alpha|d(x,0)$
>2. $d(x+z,y+z)=d(x,y)$

这里给出比等距同构弱的等价关系。

>[!math] **Definition:** 设 $X$ 是赋范空间，$\lVert \cdot \rVert_{1}$ 和 $\lVert \cdot \rVert_{2}$ 是其上两个范数，若 $\exists C_{1},C_{2}>0$ 使得
>$$
>C_{1}\lVert x \rVert_{1}\le\lVert x \rVert_{2}\le C_{2}\lVert x \rVert_{1}   
>$$
>则称 $\lVert \cdot \rVert_{1}$ 和 $\lVert \cdot \rVert_{2}$ 范数等价。

显然范数等价是同胚。度量性质下，能保持完备性、有界性、全有界性等。

---

>[!math] **Definition:** 设 $X$ 是赋范空间，若 $X$ 完备，则称 $X$ 是 Banach 空间。

>[!math] **Proposition:** 设 $X$ 是赋范空间，则 $X$ 完备等价于任意绝对收敛序列均收敛，即
>$$
>\sum_{n=1}^{\infty}\lVert x \rVert<\infty \implies \sum_{n=1}^{\infty}x_{n}\to x 
>$$

---

范数和凸性有着非常紧密的联系。

>[!math] **Definition:** 设 $A$ 是线性空间 $X$ 的子集，若对于 $\forall x,y\in X$，$\lambda\in[0,1]$ 满足
>$$
>\lambda x+(1-\lambda)y\in A
>$$
>则称 $A$ 是凸集。显然凸集无限交是凸集，若 $A$ 是 $X$ 子集，定义 $A$ 上的运算
>$$
>\mathrm{co}(A)=\bigcap_{A\subset E,E\text{ convex}} E
>$$
>是 $A$ 的凸包。

>[!math] **Proposition:** 凸集、凸包有以下性质：
> - $A$ 是凸集当且仅当 $\mathrm{co}A=A$。
> - $A$ 的凸包是 $A$ 上凸组合全体，即
> $$
> \mathrm{co}A=\left\{  \sum_{k=1}^{n}\lambda_{k}x_{k}:\sum_{k=1}^{n}\lambda=1,x_{k}\in A,\lambda_{k}\geq 0  \right\}
> $$

由于凸集平移不变，我们仅需讨论原点处的凸集。下面给出一些特殊的凸集。

>[!math] **Definition:** 设 $A$ 是包含 $0$ 的凸集，若 $\forall x\in X$，$\exists\lambda>0$，$x/\lambda\in A$，则称 $A$ 是**吸收凸集**。若 $\forall x\in A$，$|\lambda|=1$，则 $\lambda x\in A$，则称 $A$ 是**平衡凸集**。

使用 Minkowski 泛函，可以从凸集构造范数。

>[!math] **Definition:** 设 $X$ 是线性空间，$A$ 是包含 $0$ 的吸收凸集，定义 $p_{A}:X\to[0,\infty)$ 为
>$$
>p_{A}(x)=\inf\left\{  \lambda>0: \frac{x}{\lambda}\in A  \right\}
>$$

>[!math] **Proposition:** 设 $p_{A}$ 是包含 $0$ 吸收凸集的 Minkowski 泛函，则
> 1. $p_{A}\geq 0$，$p_{A}(0)=0$。(半正定性) 
> 2. $p_{A}(\lambda x)=\lambda p_{A}(x)$，$\forall\lambda>0,x\in X$。(正齐次性)
> 3. $p_{A}(x+y)\le p_{A}(x)+p_{A}(y),\forall x,y\in X$。(次可加性)
>  4. 若 $A$ 平衡，$p_{A}(\lambda x)=\lambda p_{A}(x)$。(齐次性)
>  5. 若 $A$ 满足
>  $$
>  \bigcap_{t>0} tA =\{ 0 \}
>  $$
>  则 $p_{A}(x)\ge0$ 当且仅当 $x=0$ 取等。(正定性)

>[!math] **Proposition:** 若线性空间上函数 $p:X\to \mathbb{R}$ 满足正齐次性、次可加性，则称 $p$ 是**次线性泛函**。若 $p$ 满足半正定性、次可加性、齐次性，则称 $p$ 是**半范数**。若 $p$ 满足正定性、次可加性、齐次性，则称 $p$ 是**范数**。

根据上述结论，包含 $0$ 、吸收、平衡、正定凸集的 Minkowski 泛函是范数。反之，我们也可根据范数构造上述条件凸集。

>[!math] **Proposition:** 设 $X$ 是赋范空间，令 $A=B(0,1)$，则 $A$ 是吸收、平衡、齐次、正定凸集。且 $p_{A}(x)=\lVert x \rVert$。

凸集还有更多性质。

>[!math] **Schauder:** 设 $X$ 是赋范空间，$A$ 是闭凸集，$T:A\to A$ 连续，且 $T(A)$ 预紧，$T$ 存在不动点。

---

商空间、积空间

---

有限维赋范空间
