---
title: 
date:
tags:
---


在学习这门课之前，仅需要掌握基本点集拓扑概念，多元微积分。

在这门课中，许多概念翻译成中文非常容易弄混，索性不翻译了。这门课的脉络期末再总结。

---

我们先从拓扑流形开始。

>[!math] **Defintion:** 设 $X$ 是拓扑空间，若 $\exists n\in \mathbb{N}$，满足 $\forall x\in X$，$\exists N\in \mathcal{N}(x),U\subset \mathbb{R}^{n}$ 开集，使得 $N$ 和 $U$ 同胚，则称 $X$ 是 **locally Euclidian**，且维数是 $n$。

>[!math] **Definition:** 设 $M$ 是拓扑空间，满足 $T_{2}$、$C_{2}$、locally Euclidian，则称 $M$ 是 $n$ 维**拓扑流形**，记作 $M^{n}$。

下面给出拓扑流形的结构。

>[!math] **Definition:** 设 $M$ 是 $n$ 维拓扑空间，$U$ 是 $M$ 中开集，$\hat{U}$ 是 $\mathbb{R}^{n}$ 开集，$\varphi:U\to \hat{U}$ 是同胚，则称 $(U,\varphi)$ 是 **chart**。
>
> 设 $M$ 是拓扑空间，$\{ (U_{\alpha},\varphi_{\alpha}) \}$ 是 chart 族，若 $\{ U_{\alpha} \}$ 覆盖 $M$，则称 $\{ (U_{\alpha},\varphi_{\alpha}) \}$ 是 **atlas**。

显然，存在 atlas 等价于 locally Euclidian。由于拓扑流形 $C_{2}\implies\text{Lindelof}$，故在 atlas 的 $\alpha$ 能选取可列个。

给出拓扑流形的一些性质。
>[!math] **Proposition:** 设 $M$ 是拓扑流形，则 $M$:
>1. 局部道路连通。
>2. locally compact。
>3. paracompact。

>[!math]- **Proof:** 
> 证明还在施工中，我会把所有定理先抄完，再写证明。

流形的紧性非常重要，在后续证明中多次用到。

---

接下来我们建立光滑流形的概念。

设 $U\subset \mathbb{R}^{n},V\subset \mathbb{R}^{m}$，$f:U\to V$ 若任意阶偏导数存在且连续，则称 $f$ **光滑(smooth)**，$C^{\infty}$。若 $f$ 是同胚且 $C^{\infty}$，则称 $f$ 是**微分同胚**。我们在这门课讨论的函数均为 $C^{\infty}$。

>[!math] **Definition:** 设 $M$ 是拓扑流形，$(U,\varphi),(V,\psi)$ 是坐标卡，且 $U\cap V\neq \emptyset$，称 $\psi\circ\varphi^{-1}:\varphi(U\cap V)\to \psi(U\cap V)$ 为 **transition map**。若 transition map 是微分同胚，则称 $(U,\varphi),(V,\psi)$ **compatible**。若 atlas  $\mathcal{A}$ 满足任意 chart 是 compatible，则称 $\mathcal{A}$ 是 **smooth atlas**。

>[!math] **Definition:** 设 smooth atlas  $\mathcal{A}$ 不真包含更大的 smooth atlas，则称其 **maximal**。


>[!math] **Definition:** 设 $M$ 是拓扑流形，$\mathcal{A}$ 是其上的 maximal smooth atlas，则称 $(M,\mathcal{A})$ 为**光滑流形**，$\mathcal{A}$ 是 $(M,\mathcal{A})$ 的**光滑结构**。

总结一下，定义过程为 compatible $\implies$ smooth atlas $\implies$ maximal atlas $\implies$ smooth manifold。maximal atlas 非常方便，任何相容的 chart 均在 atlas 内。

maximal atlas的条件很强，但是我们无需构造 maximal atlas，仅需找到一个 smooth atlas，使用生成的maximal atlas 即可。

>[!math] **Proposition:** 设 $M$ 是拓扑流形
>1. 每个 smooth atlas 包含在唯一的 maximal smooth atlas 中。
>2. maximal smooth atlas 相等当且仅当他们的并是 smooth atlas。

下面给出集合推流形的条件。

>[!math] **Smooth Manifold Chart Lemma:** 设 $M$ 是集合，$U_{\alpha}\subset M$，$\varphi_{\alpha}:U_{\alpha}\to \mathbb{R}^{n}$，满足下列条件：
>1. $\varphi_{\alpha}$ 是 $U_{\alpha}$ 到 $\varphi_{\alpha}(U_{\alpha})$ 的双射。
>2. $\forall \alpha,\beta$，$\varphi_{\alpha}(U_{\alpha}\cap U_{\beta}),\varphi_{\beta}(U_{\alpha}\cap U_{\beta})$ 是开集。
>3. 若 $U_{\alpha}\cap U_{\beta}$ 非空，则 $\varphi_{\beta}\circ\varphi_{\alpha}^{-1}$ 光滑。
>4. 可列 $U_{\alpha}$ 覆盖 $M$
>5. $\forall p,q\in M$，要么 $\exists U_{\alpha}$ 包含 $p,q$，要么 $\exists p\in U_{\alpha},q\in U_{\beta}$ 不相交。
>
>则 $M$ 上有唯一的 smooth manifold 满足每个 $(U_{\alpha},\varphi_{\alpha})$ 是 smooth chart。

>[!math] **Example:**  Open submanifold、$\mathrm{GL}_{n}$、Graph、$S^{n}$、$\mathbb{R}P^{n}$、Level set、Grassmann Manifold等。


---

接下来我们定义流形上的函数和映射。

>[!math] **Definition:** 设 $M$ 是光滑流形，$f:M\to \mathbb{R}^{k}$，满足 $\forall p\in M$，存在 p 处的 chart $(U,\varphi)$ 满足 $f\circ\varphi^{-1}:\tilde{U}\to \mathbb{R}^{k}$ smooth，则称 $f$ 是 $M$ 上**光滑函数**。

>[!math] **Definition:** 设 $M,N$ 是光滑流形，$F:M\to N$，满足 $\forall p\in M$，存在 p 处的 chart $(U,\varphi)$ 和 $F(p)$ 处的坐标卡 $(V,\psi)$，满足 $V\subset F(U)$，且 $\psi\circ F\circ\varphi^{-1}:\tilde{U}\to \tilde{V}$ smooth，则称 $F$ 是 $M$ 到 $N$ 上**光滑映射**。

光滑映射与拓扑空间上的连续映射性质完全相同。

>[!math] **Proposition:** 设 $M,N,P$ 是光滑流形。
>1. $\mathrm{id}_{M}$ 光滑。
>2. 常函数 $F(M)=c$ 光滑。
>3. 若 $F:M\to N,G:N\to P$ 光滑，则 $G\circ F$ 光滑。
>4. 设 $\{  U_{\alpha} \}$ 是 $M$ 的覆盖，$\exists F_{\alpha}:U_{\alpha}\to N$ 光滑，且两两相容，则 $\exists F:M\to N$ 光滑，满足 $F|_{U_{\alpha}}=F_{\alpha}$。

和拓扑空间同样，我们定义微分同胚。

>[!math] **Definition:** 设 $M,N$ 是光滑流形，若光滑映射  $F:M\to N$ ， 存在光滑逆映射，则称 $F$ 是 diffeomorphism，$M$ 和 $N$ diffeomorphic。

diffeomorphic 和同胚性质相同。

>[!math] **Proposition:** diffeomorphic 有以下性质
>1. diffeomorphism 的复合是 diffeomorphism。
>2. diffeomorphic 是等价关系。

---

接下来给出光滑流形的单位分解。

>[!math] **Definition:** 设 $M$ 是拓扑空间上的函数，定义 $f$ 的 support 为
>$$
>\mathrm{supp}f=\overline{\{ p\in M:f(p)\ne 0 \}}
>$$


>[!math] **Definition:** 设 $M$ 是拓扑空间，$\{ X_{\alpha} \}$ 是集族，若 $\forall p\in M$，$\exists U\in \mathcal{N}(p)$ 满足与有限个 $\{ X_{\alpha} \}$ 相交，则称 $\{ X_{\alpha} \}$ **locally finite**。


>[!math] **Definition:** 设 $M$ 是拓扑空间，$\{ X_{\alpha} \}$ 是开覆盖。若连续函数族 $\{ \psi_{\alpha} \}$ 满足
>1. $0\le \psi_{\alpha}\le 1$
>2. $\mathrm{supp}\psi_{\alpha}\subset X_{\alpha}$
>3. $\{ \mathrm{supp} \psi_{\alpha} \}$ 是 locally finite。
>4. $\sum_{\alpha} \psi_{\alpha}=1$
> 
> 则称 $\{ \psi_{\alpha} \}$ 是 $\{ X_{\alpha} \}$ 的 partition of unity。若 $M$ 是光滑流形，$\psi_{\alpha}$ 是光滑函数，则称 $\{ \psi_{\alpha} \}$ 是 smooth partition of unity。

>[!math] **Theorem:** 设 $M$ 是光滑流形，$\{ X_{\alpha} \}$ 是开覆盖。则存在 $\{ X_{\alpha} \}$ 的 **smooth partition of unity**。


>[!math] **Theorem:** 设 $M$ 是光滑流形，$A$ 是闭集，$U$ 是 $A$  的邻域。则存在  $\psi:M\to \mathbb{R}$ 光滑满足
>1. $0\le \psi\le 1$
>2. 在 $A$ 上 $\psi\equiv 1$ 
>3. $\mathrm{supp\psi}\subset U$
>
> 称为  **bump function for $A$ supported in $U$**。

>[!math] **Theorem:** 设 $M$ 是光滑流形，则存在光滑非负函数  $f$ ，满足  $f^{-1}(-\infty,c])$ 是紧集，称为  **exaution function for $M$**。

>[!math] **Theorem:** 设 $M$ 是光滑流形， $K$ 是闭集，则存在光滑非负函数  $f$，满足 $f^{-1}(0)=K$。


