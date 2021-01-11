export default {
  components: {
    vnodes: {
      functional: true,
      render: (h, ctx) => {
        const { render, props, on } = ctx.props;
        if (typeof render === "function") {
          const content = render(h, props, on);
          if (
            typeof content === "string" ||
            typeof content === "boolean" ||
            typeof content === "number"
          ) {
            return h("span", content);
          }
          return content;
        }
        // VNode
        return render;
      }
    }
  }
};
