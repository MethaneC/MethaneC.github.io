---
title:
date:
tags:
---
这一段应该放到拓扑里的。但是拓扑还没写好，暂存在泛函中。

>[!math] **Defintion:** 设 $d:X\times X\to \mathbb{R}$，满足
>1. $d(x,y)\geq 0$。当且仅当 $x=y$ 取等。
>2. $d(x,y)=d(y,x)$
>3. $d(x,z)\le d(x,y)+d(y,z)$
>
>则称 $d$ 是 $X$ 上的度量。定义开球
>$$
>B(x,r)=\{ y\in X:d(x,y)<r \}
>$$
>则 $B(x,r)$ 构成 $X$ 上的基。此时称 $(X,d)$ 是**度量空间**。

>[!math] **Defintion:** 若 $A\subset X$ 满足以下等价条件，则称 $A$ 有界
> - $\exists x_{0}\in X,r>0$，使得 $A\subset B(x_{0},r)$
> - $\forall x\in X$，$\exists r>0$，使得 $A\subset B(x,r)$
> - $\mathrm{diam}A=\sup\{ d(x,y):x,y\in A \}<\infty$

拓扑空间上的诸多定义就不废话了。度量空间有很好的拓扑性质。

>[!math] **Proposition:** 设 $X$ 是度量空间，则
>1. $X$ 是 $T_{2}$、$C_{1}$ 空间。
>2. 若 $X$ 可分，则 $X$ 是 $C_{2}$ 空间。

>[!math] **Defintion:** 设 $X,Y$ 是度量空间，若 $T:X\to Y$ 是同胚，且 $d_{Y}(Tx,Ty)=d_{X}(x,y)$，则称 $T$ 是等距同构。等距同构是等价关系。

---

度量空间的性质需要等距同构才能保持，例如有界性，还有接下来的完备性，全有界性。

>[!math] **Defintion:** 设 $X$ 是度量空间，定义
> - 设 $\{ x_{n} \}\subset X$，若 $\forall\epsilon>0$，$\exists N>0$ 使得 $\forall m,n>N$ 有 $d(x_{n},x_{m})<\epsilon$，则称 $\{ x_{n} \}$ 是 Cauchy 列。
> - 若 $X$ 中的 Cauchy 列均收敛，则称 $X$ 是完备的。

Cauchy 列有非常好的性质

>[!math] **Proposition:** 设 $\{ x_{n} \}$ 是 Cauchy 列，则
>1. $\{ x_{n} \}$ 收敛等价于存在子列收敛。
>2.  $\{ x_{n} \}$ 存在快速 Cauchy 子列 $\{ y_{n} \}$，即
> $$
> d(y_{n+1},y_{n})\leq a_{n},\qquad \sum_{n=1}^{\infty}a_{n}<\infty
> $$
>3. 若 $\{ y_{n} \}$ 收敛，则存在 Cauchy 子列。


完备度量空间有以下性质。

>[!math] **Proposition:** 设 $X$ 完备，$F_{n}$ 是非空递减闭集，则
>$$
>\bigcap_{n=1}^{\infty}F_{n}\ne \emptyset
>$$

>[!math] **Banach 不动点原理:** 设 $X$ 完备，$T:X\to X$ 是映射，满足 $d(Tx,Ty)<\alpha d(x,y)$，其中 $0<\alpha <1$。则 $T$ 具有唯一不动点。  

而对于任意度量空间，我们都可以嵌入完备空间。

>[!math] **Thereom:** 设 $X$ 是度量空间，则存在完备空间 $\tilde{X}$ 使得 $X$ 和 $\tilde{X}$ 的稠密子空间同构。且在等距同构下 $\tilde{X}$ 唯一。称 $\tilde{X}$ 是 $X$ 的完备化。 

---

完备度量空间还是 Baire 空间，接下来我们陈述 Baire 空间相关概念，这些概念在一般的拓扑空间仍成立。（这一段有时间单列一部分）

>[!math] **Definition:** 设 $X$ 是拓扑空间，$A\subset X$ 是子集，则
>- 若 $(\overline{A})^{\circ}=\emptyset$ ，则称 $A$ 在 $X$ **稀疏**。
>- 若 $\overline{A}=X$ ，则称 $A$ 在 $X$ **稠密**。
>- 若 $A$ 是可列稀疏集的并，则称 $A$ 是**第一纲集**。
>- 若 $A$ 不是第一纲集，则称 $A$ 是**第二纲集**。

第一纲集类似于测度中的零测集，都是比较小的集合。

>[!math] **Proposition:** 设 $A$ 是子集，$A$ 稀疏与以下等价。
> - $\overline{A}$ 稀疏。
>  - $(\overline{A})^{c}$ 稠密。
> 
> 关于第一纲集，有结论
> - 稀疏集是第一纲集。
> - 第一纲集的可列并是第一纲集。
> - 第一纲集的子集是第一纲集。

>[!math] **Definition:** 若满足以下等价定义，则称 $X$ 是 **Baire 空间**。
>-  $X$ 中可列稠密开集交稠密。
>-  $X$ 中可列稀疏闭集并稀疏。
>- $X$ 中任意非空开集是第二纲集。


>[!math] **Baire 纲定理:** 完备度量空间是 Baire 空间。

---

下面我们考虑度量空间的紧性。

>[!math] **Definition:** 设 $A$ 是 $X$ 子集，若
> - 任意 $A$ 的开覆盖，存在有限子覆盖，则称 $A$ **紧致**。
> - 若 $\overline{A}$ 紧致，则称 $A$ **预紧**。
> - $\forall \epsilon>0$，存在有限 $\{ x_{n} \}$ 使得 $A\subset \bigcup B(x_{n},\epsilon)$ 则称 $A$ **全有界**。

对于这些概念，有对应的点列刻画。

>[!math] **Proposition:** 设 $A$ 是 $X$ 子集，则
>- $A$ 紧致，等价于任意点列 $\{ x_{n} \}\subset A$ 存在收敛于 $A$ 的子列。
>- $A$ 预紧，等价于任意点列 $\{ x_{n} \}\subset A$ 存在收敛子列(不一定在 $A$ 中)。
>- $A$ 全有界，等价于任意点列 $\{ x_{n} \}\subset A$ 存在 Cauchy 子列。

从此可以看出，$A$ 紧致等价于 $A$ 完备且全有界。若 $X$ 完备，则 $A$ 预紧等价于 $A$ 全有界。

紧空间上的连续函数有着以下性质。

>[!math] **Proposition:** 设 $X$ 是紧空间，定义 $C(X)$ 是 $X$ 上的连续函数，取 $d(f,g)=\sup|f-g|$，则 $C(X)$ 是完备度量空间。

>[!math] **Definition:** 设 $X$ 是紧空间，$F\subset C(X)$ 。若 $\exists M$，使得 $|f|\le M,\forall f\in F$，则称 $F$ **一致有界**。若 $\forall \epsilon>0$，$\exists\delta$ 使得 $\forall d(x,y)<\delta$ 有 $|f(x)-f(y)|<\epsilon$，则称 $F$ **等度连续**。 

>[!math] **Arzela-Ascoli:** 设 $X$ 是紧空间，$F\subset C(X)$ **预紧**当且仅当 $F$ **等度连续**、**一致有界**。