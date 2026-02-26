# ODT

当需要区间操作 (合并,分裂,覆盖等), 一种比较暴力的想法是直接去维护所有区间.

柯朵莉树可以保证在随机数据下拥有很好的复杂度并且易于实现, 思路清晰.

储存所有区间, 考虑使用链表或者平衡树. 一般使用后者即可. 于是定义区间为:
```cpp
  struct SEG{
    int l,r; // 左右端点
    mutable type v; // 区间值
    // 初始化
    // < 重载, 因为是区间所以只用比左端点
  };
```

要分裂区间, 直接查找即可. 同时返回分裂后的后半区间. 此处分裂后两个区间为 $[l,idx),[idx,r]$.

```cpp
  auto spl(int idx){
    auto t=odt.lower_bound(SEG(idx,0,0));
    if(t!=odt.end()&&t->l==idx)return t; (idx 是一个存在区间左端点)
    int l=(--t)->l,r=t->r,v=t->v;
    odt.erase(t);
    odt.insert(SEG(l,idx-1,v));
    return odt.insert(SEG(idx,r,v)).first;
  }
```

要区间赋值 (推平区间), 也相当暴力. 找到有交的所有区间然后暴力修改.

```cpp 
  void chg(int l,int r,type v){
    auto tr=spl(r+1),tl=spl(l); // 不能反, 否则 tl 可能在做 tr 时候被吞了
    odt.erase(tl,tr); // set 区间删除
    odt.insert(SEG(l,r,v));
  }
```

对区间进行更加细致的操作, 和 chg 一样, 遍历 $[tl,tr)$ 即可.
