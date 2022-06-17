import type { NextPage } from "next";
import * as react from "react";
import Head from "next/head";
import * as d3 from "d3";

const svgWidth = 1500;
const svgHeight = 1000;

const simulation = d3
  .forceSimulation()
  .force("link", d3.forceLink())
  .force("charge", d3.forceManyBody().strength(-15000))
  .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2));

const Home: NextPage = () => {
  const ref = react.useRef(null);
  const nodesData = [
    {
      label: "信",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202443-ec2d2796-e2cb-4303-8d63-30d0d3af3a21.svg"
    },
    {
      label: "嬴政",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202434-00417d0e-9b49-4d4f-ad62-3e36c8d1a273.svg"
    },
    {
      label: "王騎",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202441-faca2bed-1070-40d8-9423-586e23c9de61.svg"
    },
    {
      label: "騰",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202448-64284d4b-e34e-44bf-a121-734269cc85bb.svg"
    },
    {
      label: "太后",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202446-eeef8c33-e20f-4f72-8f63-a66256f771be.svg"
    },
    {
      label: "漂",
      imageLink: "https://user-images.githubusercontent.com/68677002/174202440-f4936f2e-38fe-49ff-8ab2-1b9ee6580c80.svg"
    }
  ];

  const linksData = [
    { source: 0, target: 1, label: "友達" },
    { source: 0, target: 5, label: "親友" },
    { source: 1, target: 2, label: "主従関係" },
    { source: 1, target: 4, label: "親子" },
    { source: 1, target: 5, label: "顔そっくり" },
    { source: 2, target: 3, label: "主従関係" }
  ];

  const dragStarted = (event: any, d: any) => {
    // どういうことなのか調べる
    if (!event.active) simulation.alphaTarget(0.3).restart();
  };
  const dragged = (event: any, d: any) => {
    d.fx = event.x;
    d.fy = event.y;
  };
  const dragEnded = (event: any, d: any) => {
    // どういうことなのか調べる
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  react.useEffect(() => {
    const linkEntered = d3.select(ref.current).selectAll("link").data(linksData).enter();

    const link = linkEntered.append("line").attr("stroke-width", 1).attr("stroke-width", 1).attr("stroke", "black");

    const linkText = linkEntered
      .append("text")
      .text((d) => {
        return d.label;
      })
      .attr("stroke", "green");
    const nodeEntered = d3.select(ref.current).selectAll("circle").data(nodesData).enter().append("g");

    nodeEntered
      .append("image")
      .attr("fill", "LightSalmon")
      .attr("xlink:href", (d) => d.imageLink)
      .attr("width", "100px")
      .attr("height", "100px")
      .call(d3.drag<SVGImageElement, any>().on("start", dragStarted).on("drag", dragged).on("end", dragEnded));

    nodeEntered
      .append("text")
      .attr("dx", -20)
      .text((d) => {
        return d.label;
      });

    const ticked = () => {
      link
        .attr("x1", function (d: any) {
          return d.source.x;
        })
        .attr("y1", function (d: any) {
          return d.source.y;
        })
        .attr("x2", function (d: any) {
          return d.target.x;
        })
        .attr("y2", function (d: any) {
          return d.target.y;
        });

      linkText
        .attr("x", function (d: any) {
          return (d.source.x + d.target.x) / 2;
        })
        .attr("y", function (d: any) {
          return (d.source.y + d.target.y) / 2;
        });

      nodeEntered.attr("transform", function (d: any) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    };

    simulation.nodes(nodesData as d3.SimulationNodeDatum[]).on("tick", ticked);
    const forcedLink = simulation.force("link")! as any;
    forcedLink.links(linksData);
  }, [ref]);

  return (
    <div>
      <Head>
        <title>D3 Playground</title>
      </Head>

      <main>
        <svg ref={ref} width={svgWidth} height={svgHeight}></svg>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
