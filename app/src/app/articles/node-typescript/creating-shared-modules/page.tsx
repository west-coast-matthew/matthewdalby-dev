import { Metadata } from "next";
import { parseHeaders } from "@/utils/page-utils";
import ArticleTemplateLayout from "@/app/articles/article-template";
import { Fade } from "react-awesome-reveal";
import CodeSnippet from "@/components/CodeSnippet";
import path from "path";
import fs from "fs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Matthew Dalby: Articles: API Design: Exception Handling",
};

let filePath = path.join(
  process.cwd(),
  "public",
  "article-content",
  "node",
  "creating-shared-modules",
  "bundler-export.txt"
);

const exportCfg = fs.readFileSync(filePath, "utf-8");

filePath = path.join(
  process.cwd(),
  "public",
  "article-content",
  "node",
  "creating-shared-modules",
  "example-shared-package-json.txt"
);
const clientPackageJson = fs.readFileSync(filePath, "utf-8");

export default async function ArticlePage() {
  const { selPath, selArticle } = await parseHeaders();

  return (
    <ArticleTemplateLayout selPath={selPath} selArticle={selArticle}>
      <Fade>
        <h2 className="subtitle">Introduction</h2>
        <p>
          This article discusses my experiences creating shared modules in
          Node.js. As an veteran Java developer, the node ecosystem is an
          interesting experience at first, but I have found it to be a very
          productive environment.
        </p>

        <p>
          There is a notable contrast between the two stacks, I would compare
          it. roughly to staring at the console of you average vehicle you have
          a simplified set of options. In my case, I have a 4x4, so there are a
          few more choices including options related to offroading. When you
          stare at the console of any given aircraft, it becomes immediately
          apparent that there way, way, more options. I would use that analogy
          to constrast the configuration options between both worlds.
        </p>

        <p>
          My first few experiences with node were weekend side projects. Pretty
          easy, smooth sailing. In recent years, a brief AI session can get you
          up and running in a matter of mere minutes. Like a lot of things
          however, the devil is in the details. Once you stepp off the beaten
          path, you may find yourself in a downard spiral of configuration
          options. Keep in mind, this is mostly driven by a Typescript based
          approach. Simply put, there are a lot of configuration options at the
          time this article was publsihed.
        </p>

        <p>
          I will cover here in this article how to create a shared module, for
          those interested in centralizing common code across multiple projects.
          As an active member of the node community, you rely on various
          external open source shared modules, however the act of creating your
          own modules might be less of a common practice.
        </p>

        <p>
          After attempting to disect a large project into a series of more
          granular projects, I fell flat on my face stumbling with the endless
          options, and ended up actually at a dead end. I would describe that
          experience as a top down approach, where an existing project is
          decomposed into smaller units. After lengthy troubleshooting sessions
          with ChatGPT, I hit a hard dead end.
        </p>

        <p>
          In response, I took a bottom up approach, create a bare bones project
          to prove out the configuration options according to my specific
          vision, which I will cover in this article.
        </p>

        <p>
          I have a full project available on github which illustrates the
          working concept, which is publically available, so I will refer anyone
          there rather than listing complete source code here so I won&apos;t
          list full confiruation details here.
        </p>
      </Fade>

      <Fade>
        <h2>How did we get to this state of complexity</h2>

        <p>
          There is a longer history of the Javascript/Typescript ecosystem that
          I won&apos;t even attempt to cover here. The key take away is that
          things are rapidly evolving, and moving in an exciting direction. This
          does come at a cost of backwards compatibility at scale due to the
          popularity of the language.
        </p>
      </Fade>

      <Fade>
        <h2>A barebones working implementation</h2>

        <p>
          Let&apos;s cover a few of the requirements I am attempting in this
          effort
        </p>

        <ul>
          <li>
            Typescript based shared module, headless, intended for consumption
            by other modules
          </li>
          <li>Support for path aliasing for cleaner dependency references</li>
          <li>
            No requirement for including file extensions on imported files (i.e.
            ./my)
          </li>
          <li>Support for async operations</li>
          <li>Support for ESModule &apos;import/export&apos; style syntax</li>
        </ul>

        <h3>Typescript configuration</h3>
        <p>
          The &apos;tsconfig.json&apos; file contains a few critical points.
          Again, I won&apos;t attempt to give the full confugration here, as is
          it available on the related github project. The key takeaway is does
          the configuration support building to a dedicated output directory.
        </p>

        <h3>Package JSON configuration</h3>
        <p>
          The package.json file requires a few key configuration points in order
          for consuming applications to interpret how to interpret the
          application.
        </p>

        <h3>Creating the bundler file for exports</h3>
        <p>
          As an entry point into the application, a single bundler file is
          defined. It&apos;s worth noting that there are some syntactical
          nuances that can cause a few headaches. Given this configuration, the
          import/export approach will not work as VS code will fail to recognize
          the associated typescript related information. As an result, code
          suggest will simply &apos;not work&apos; within VS code.
        </p>

        <p>Let&apos;s take a look at the following</p>

        <CodeSnippet srcCode={exportCfg} />

        <p>
          In the above example, we illustrate two approaches to exporting
          functionality from our shared module. To summarize feedback after a
          late night GPT session (trust me talking like 2 AM).....
        </p>

        <p>
          &quot;But this creates a local binding in the file, which can
          sometimes be inlined or lost in .d.ts files if TypeScript can&apos;t
          trace it clearly. This can lead to type declarations that are: Missing
          Incomplete or don’t propagate properly to consumers&quot;
        </p>

        <p>
          For me this translates into &apos;Unknown territory&apos; in my book,
          so I have adapted course accordingly.
        </p>

        <h3>Publishing the module for consumers (Development mode)</h3>
        <p>
          When developing shared module, it is understandable that there will be
          numerous iterations. In a perfect world, features are introduced, unit
          tested, and the final product is a well isolated deliverable unaware
          of any potential consumers. This is most certainly the case with
          deliverables intended for open source, wide use distribution. This is
          not always the case.
        </p>

        <p>
          For iterative development cycles, &apos;yarn link&apos; is a great
          development cycle approach. The process involves creating essentially
          a symlink between a shared module, and any consumers. Let&apos;s walk
          through the steps.
        </p>

        <ol>
          <li>
            Ensure the &apos;name&apos; in the package.json in your shared file
            has a meaningful name as other projects will reference it via this
            context.
          </li>
          <li>
            Change into the root directory of your share module. Execute the
            `yarn/npm link` command. The package manager really is not really
            matter as it is up to your preference. This will establish a global
            symlink to your project, the same location where packages are
            installed under the global package manager install commands.
          </li>
          <li>
            Change into any given consumer project, and execute the yarn link
            [project name] where the name is the name of the shared project
            defined in the previous step. This would be performed in place of
            the normal &apos;npm/yarn install [project name]&apos; command.
          </li>
          <li>
            In both installation approaches, an element will appear under the
            corresponding sub folder based on the shared library name. To
            validate successfull installation, perform and &apos;ls -l
            ./node_modules/[shared project name]&apos;, from which the results
            should reflect the new reference is essentially a symlink.
          </li>
        </ol>

        <p>
          This will put you into a position where your changes in the shared
          project are available in your local environment. There are a few
          approaches given this approach. I would recommend that you follow down
          the path where your project is &apos;built&apos;, compiled under the
          dist directory.
        </p>

        <h3>Publishing the module for consumers (Production)</h3>
        <p>
          Once shared development activity slows down, publishing to a non local
          shared repo is the correct long term approach. The following steps are
          required to implement the link based approach towards sharing your new
          module.
        </p>

        <CodeSnippet srcCode={clientPackageJson} />

        <p>
          The above example represents the minimum required steps to publish
          your shared module to a public repo. Additional configuration steps
          would be required to publish to an internal private repo. This could
          be an privately hosted option or one where the source resides on a
          third party provider requiring credentials. In either case, be aware
          that publishing to a shared repo given this path requires updating the
          &pos;version&pos; element within an incrementing version number. Given
          this requirement, rapid development iterations such as general
          development and integration should be performed via the above link
          approach, until you are ready for a formal publishing effort.
        </p>

        <p>
          When migrating from a link based solution as detailed above, an
          additional step is required as follows. Simply perform an
          &pos;yarn/npm unlink&pos; operation in all consumer apps, and then an
          &pos;yarn/npm install [shared library name]&pos; to reference the
          published package for integration testing.
        </p>

        <h3>In summary</h3>
        <p>
          There is value in creating shared libaries, when appropriate. There is
          overhead with this action, it will impact your workflow. My normal
          philosophy of keeping it simple, i.e. starting with a single project,
          and then attempting to decompose it into shared modules at some future
          point really came back to haunt me in terms of setting up
          node/Typescript related configurations nailed down. I would
          &pos;Highly&pos; recommend instead of my original approach which could
          be described as &pos;top down&pos; refactoring, to adopt and
          &pos;bottom up&pos; approach where an experimental pair of projects
          (shared project and consumer) are defined and then the configuration
          settings are transferred over to the actual code base. This simplifies
          the moving pieces, and assists in streamlining and troubleshooting
          steps.
        </p>

        <p>
          I have published a working example on Github that illustrates my
          particular configuration for my efforts, located at (
          <Link
            href={
              "https://github.com/west-coast-matthew/boilerplate-node-shared-library"
            }
          >
            https://github.com/west-coast-matthew/boilerplate-node-shared-library.
          </Link>
          )
        </p>
      </Fade>
    </ArticleTemplateLayout>
  );
}
