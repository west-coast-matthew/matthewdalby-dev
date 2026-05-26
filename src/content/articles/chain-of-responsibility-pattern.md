---
title: "The chain of responsibility pattern"
date: "December 1, 2025"
excerpt: "A real world example of the chain of responsibility design pattern"
readTime: "13 min read"
category: "Software Engineering"
---

## Introduction

        

          I am a big fan of design patterns. When I make observations, I try and
          look for patterns, it's in my nature. If we had a conversation
          about graphic design, I would touch on the elements of design, or
          essentially applied 'patterns' that allow people to create
          visually appealing experiences. And what I find interesting is that
          patterns can also be applied to architecture, and of course software
          design.
        

        

          Personally I don't spend enough time on greenfield efforts where
          I can implement a lot of the classic patterns directly, so I wanted to
          share an actual applied real world use case. I don't believe
          memorizing common design patterns is enough, and I really make an
          effort to find practical cases where they could be applied.
        

        

          In this article I will illustrate how I had applied the visitor
          pattern on a past project. That particular effort involved applying an
          insane amount of business logic documented by somewhere around 70
          pages of densly packed flowcharts. The resulting code base was equally
          verbose, full of decision points, business rule implementation, and
          edge cases. Anyone tasked with diving into the routine would be
          initially expected to perhaps be overwhelmed the implementation based
          on the mere amount of source code. The good news is, the source code
          is fairly well documented, the main entry point features a developer
          friendly 'start here' title, a reference to the famous line
          'dont panic' (Hitchhikers guide to the galaxy), and
          explicitly mentions the visitor pattern as the applied approach for
          the effort. Aha, suddenly you have a starting point, a framework for
          understanding the overall theory behind thousands of lines of code.
        

        

          The pattern is not necessarily langauge/framework specific, but we
          will hit on examples in Typescript and Java in this article.
        

        

          Let's take a look at how any why we apply this pattern in a real
          world scenario. I will attempt to provide just enough domain
          background to put the example into context, but not enough to infringe
          on any IP related to previous employers. The source provided is a
          simplified version of the actual implementation, however it captures
          the essence of the applied pattern.
        

        

## Introducing or perhaps re-introducing the chain of reponsibility
          pattern

        

          So we will be modeling the 'chain of responsibilty pattern'
          for this solution. Let's dive into what example that is, the
          advantages, and what makes this a good use case.
        

        

          A few quick searches for this pattern yields descriptions implying
          that this pattern a good approach for applying a flexible and
          extensible chain of handlers to process requests. I particularly like
          the definition 'This pattern allows for a chain of objects to
          process a request, with each object in the chain having the
          opportunity to handle the request or pass it along to the next object
          in the chain'.
        

        <blockquote>
          Chain of Responsibility is a behavioral design pattern that lets you
          pass requests along a chain of handlers. Upon receiving a request,
          each handler decides either to process the request or to pass it to
          the next handler in the chain.{" "}
        </blockquote>

        

          I won't attempt to go into a great level of detail about the
          pattern in this article, as there is a lot of excellent content out
          there that does quite an excellent job of doing this already.{" "}
          [
            I highly recommend this link
          ](https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/){" "}
          has a great write up on this pattern, and numerous others.
        

        

          In short, we have some type of parent process that delegates
          processing to a series of smaller dedicated units that handle the
          processing details. We can refer to the parent process as a
          'client', and each unit applying the logic as a
          'handler'. by defining an interface that represents the
          contract between the client and all the handlers, we can establish a
          level of decoupling between the functional areas.
        

        

## The domain problem

        

          So a little bit of background on my past project. This was an effort
          in the beverage manufacturing space, specific the wine industry. This
          was for a large organization, which produced a very large volume of
          consumer products. The manufacturing steps involved combining wine
          from numerous sources, performing many manufacturing steps from the
          time the original grapes were harvested until the finished goods are
          packaged into the consumer ready bottle.
        

        

          Attempting to provide enough background here to create an applied
          example, but won't waiste any time on specifc details, in the
          interest of keeping things concise, and respect for ip related to
          previous employers. The spirit here is just provide a real world
          example of an applied pattern.
        

        

          A key requirement was to track varietal information. We need to know
          if the wine is a cabernet, merlot, or a chardonnay. We also need to
          know which region it originated from, which vinyard, etc. For what are
          referred to as 'mixed reds', the origins for any finished
          goods may be quite very numerous. So numerous that it is common to
          encounter a particular batch that has hundreds of records associated
          with it, and at some point we reach a threshold where the information
          begins to become irrelevant, and a requirement to summarize the
          records arises, for which the algorithm or process to perform the
          summarization is the focus of this article.
        

        

          For example, bottling 50,000 gallons of red wine would require
          gathering grapes from many different locations, as it is unlikely that
          a single location or vinyard would be unlikely. Additionally, wine
          from different locations may be blended for a desired flavor and price
          point, and of course labelling claims. Wine bottled as 'Sonoma
          county' means that the origins originated from that location, and
          product labeled as 'california' is a much more course
          grained definition. The number of records indicating the origins for
          the first case would be inheritly fewer than in the second. There does
          come a point where it does not make sense to keep an excessive amount
          of origin or varietal related data. For example, if we stage wine into
          that 50,000 gallon tank, we may not be concerned with the fact that
          100 gallons or .2% is not as relevant as tracking the amount of the
          final result is red, or from a particular region, etc. There is the
          point of diminishing return, where the information basically becomes
          irrelevant. For our purposed, let's call that number 200. So if
          we transfer wine from different sources into a common tank.
        

        

          In summary, there are a lot of steps in the wine manufacturing process
          (at scale), we collect varietal related information each step of the
          way, and sometimes we end up with too much information, and we need to
          summarize individual records to keep within a reasonable threshold of
          information.
        

        

### Reducing the noise

        

          So at a very high level, we need to start combining records into more
          generic pieces of information. As previously mentioned, more granular
          records can be combined into a more generic record. So if we have a
          record that represents a very small percentage of the overall
          contents, with very specific information, we can potentially say that
          particular record, and other similar ones, could be simply condensed
          into a single record which represents the fact that is 'red wine
          from california' or perhaps just 'red wine'.
        

        

          The same idea could be applied to candy. For example, if a particular
          batch of chocolate contains 99.9999% generic white sugar, and the
          remaining percent could be considered 'organic sugar'. The
          fact that such a small percentage is non organic could be considered
          noise, and we can merge the two records. The inverse is true, so if
          the product is labeled as 'organic sugar' or perhaps
          'pure cain sugar', there is probably a legal requirement
          that at least a certain percentage of the overall sugar content is not
          only 'sugar' but also 'organic'. Yes, that is
          correct, 100% does not really mean 100% in the labeling world in all
          cases, but rather 'pretty damn close to 100%'.
        

        

          So approaching the process of taking a large number of records, and
          combining the records with the smallest percentages into more generic
          records involves looping, one big giant loop, starting with the
          smallest percentage, and gradually increasing the threshold in a very
          conservating manner in effort to preserve the overall integretity is
          the approach. In this particular case, there is an additional set of
          rules that need to be applied that pertain to how and where to handle
          the process of combining or 'rolling up' granular records
          into more course grained records also exist. These rules also have an
          order or precidence, and are applied in order of least destructive to
          more destructive. So, we have essentialy two loops executing, and
          inner and an outer, working together in the least destructive manner,
          in order to maintain as much precision as possible, until the desired
          threshold is met.
        

        

          The actual logic related to how things are combined are not relevant
          for the purpose of this excersize,, the important thing to remember is
          that there were around 12 in the actual implementation. So, lot's
          of looping, lot's of rules potentially applied for combining
          them. Each rule may or may not be applied based on the current
          scenario. Lot's of potential for a big ball of messy
          implementation logic and associated technical debt, and like how to we
          set ourselves up for unit testing, and minimize the effort related to
          future changes in logic?
        

        

## Designing a solution

        

Let's whip up a class diagram for illustration purposes.

        

          So first we establish an entry point, separation of responsibilities
          applied, we just accept an collection of records. Something like,
          accept a bunch of records, attempt to see if we actually need to do
          any work, and create an outer loop.
          'VarietalCompressionService' is the main entry point into
          this overall process.
        

        

          Next we establish an interface, a decoupling between the main loop and
          the other moving pieces responsible for performing the actual work.
          'Rule' is the interface that all the individual rules will
          implement. This establishes a level of abstraction between the main
          orchestration piece and the individual rules. Anything considered a
          rule basically accepts a series of records, and a percentage
          threshold, and returns a potentially modified series of records.
          Essentially that is all the two roles (the main orchestration process
          and the actors that aply the actual logic) care about.
        

        

### Throwing out a life raft

        

          the logic here is to large to contain within a single file, at best a
          series of files, one for an orchestration piece, and one for each
          handler or unit responsible for performing logic. personally, if i
          were to inherit this piece of logic, I would look for an entry point,
          and start there.
        

        

[code]
/**
			RecordReducer

			'Main' entry point into the the overall process of conditionally reducing information information related to what would be considered an 'excessive' amount of information representing composition in the least destructive manner.

			Start here ! and don't panic (https://en.wikipedia.org/wiki/The_Hitchhiker%27s_Guide_to_the_Galaxy).

			This method represents the entry point from some other process that performs the following:

			The approach implemented here would be defined as the 'https://en.wikipedia.org/wiki/Chain-of-responsibility_pattern'. In a nutshell, this class will accept a series of records, and if the total count exceeds a threshold, then this entry point will essentially orchestrate an outer loop that will delegate operations to other logical units as per the aformentioned pattern. 

			This class in the wikipedia definition fits the role of the 'sender'.

			The interface 'RuleProcessor' fits the role of anything that will be responsible for handling the logic.

			All implementations for handling the logic will implement the 'RuleProcessor' interface. 

			The dedicated package structure should reflect that this logic is structured in an isolated manner. Concerns about 'where' the data originates from and the final 'destination' of the results are externalized. 

			Naming conventions of 'rule' implementations follow the naming convention 'RuleXXXX' where the 'XXXX' suffix is used to indicate the nature of the implementing rule. Keep in mind, any reference to an applied order 'should' be avoided in order to decouple the ordering of how they are applied. 

		*/
[/code]

        

### The actual implementation

        

          So we have an outer loop, gradually increasing the percentage
          threshold, and an inner loop, iterating through a series of rules,
          each rule implementing a common interface. Each rule gets a chance to
          apply its logic, if applicable, and the process continues until we
          reach the desired threshold.
        

        

[code]
/**
    VarietalCompositionEntry

    Represents a piece of information that represents varietal information (i.e. 
    what type of wine is this, where did it originate from...)

*/
class VarietalCompositionEntry{
    BigInt percentage;
    Variety variety;
    Vineyard vineyard;
}

/**

    VarietalCompressionServiceImpl

    'sender' role in the 'chain of responsibility' pattern. Basically establishes an outer loop
    that works from the smallest percentage upwards in order to delegate the task of condensing 
    pieces of information into more generalized groups in order to meet an overall maximum record count threshold, in the least destructive manner.
*/
public class VarietalCompressionServiceImpl{

    public List<VarietalCompositionEntry> ensureMaxEntryLogicApplied(List<VarietalCompositionEntry> entries){

        // So this is the max number of entries....
        public static final MAX_ENTRY_COUNT = 200;

        // We define the amount we incrementally attempt to apply rules towards 
        final BigDecimal incrementAmount = .0000000001;

        // Ensure we only apply logic if ncessary
        if(entries.size()<=MAX_ENTRY_COUNT){
            return entries;
        }

        // Determine the smallest percentage we apply based on the min percent value present in the 
        // set of records
        BigDecimal minPct = ...

        // Let's configure a series of rules that will actuall do the work...
        Rule rule1 = new CompressToNapaRegions();
        Rule rule2 = new CompressToMixedRed();
        Rule rule3 = new CompressToCaliforniaVarietal();

        rule1.setNextRule(rule2);
        rule2.setNextRule(rule3)

        /**
            Main looping routine:

            So we call the first rule in the chain, pass in the entries we are attempting to 
            reduce, in addition to a threshold. A small deviation from a more simple implementation 
            of this pattern in the sense that we still delegate the work to the 'chain' however 
            we perform this in a loop, ever so slightly incrementing the criteria for which entriesbased on percentage become eligible for the logic.
        */
        for(x=minPct;x<100;x+incrementAmount){
            entries = rule1.applyRule(entries,x);
            if(entries.size()<=MAX_ENTRY_COUNT){
                return entries;
            }
        }

        return entries;
    }
}

/**
    Rule

        Interface responsible for defining common behavior for all classes responsible for 
        performing actions related to attempts to 
*/
public interface Rule{
    public List<VarietalCompositionEntry>entries applyRule(List<VarietalCompositionEntry>entries, threshold);
    public void setNextRule(Rule rule);
}

public abstract class extends AbstractRule{
    protected Rule nextRule;
}

/**

*/
public class CompressToCaliforniaVarietal implements Rule extends AbstractRule{

    List<VarietalCompositionEntry>entries(List<VarietalCompositionEntry>entries, threshold){
        /* So here we would apply logic in an attempt to reduce entries. The actual logic is not 
         important for this excersize, the important take away is that this rule applies
         logic that is conditionally applied based on whatever factors that come into play.
         Ideally, the logic would immediately return the modified/reduced set of records once 
         the mas record count threshold is met. Otherwise, it delegates additional processing 
         to other rules (should a 'next' rule be defined).
         */

    }

    void setNextRule(Rule rule){
        nextRule = rule;
    }

}

/**

*/
public class CompressToMixedRed extends AbstractRule{

}

/**

*/
public class CompressToNapaRegions extends AbstractRule{

}
[/code]

        

### A few observations

        

          The percentage thresholds in the outer loop are defined as constants,
          small tweak in the event that we may need to alter this behavior.
        

        

          Rules link to each other, however are are themselves decoupled as they
          maintain the level of abstraction via their shared common interface.
          reordering them, adding or removing new rules becomes a simple linked
          list type operation.
        

        

          Breaking down the core logic (rules) results in smaller more testable
          units. by externalizing a lot of the details provided to the rules, we
          inheritely can mock data to inject into implementations, we make the
          process of applying testing much easier to facilitate.
        

        

          The 'client' or main orchestration piece is fairly concise,
          easy to read, and understand at a high level. It does define the
          rules, and the order they execute in, however the rules operation
          independantly of each other, which allows updates to be performed in
          an isolated manner. Changes the the logic may be esaily applied, and
          even changes to the order of execution or addition/removal of rules
          can be performed with minimal impact to the overall process.
        

        

### The resulting Java implementation

        

          The following is an implementation in Java. I will skip the Node
          implementation as it would be redundant.
        

        

[code]
/**
    VarietalCompositionEntry

    Represents a piece of information that represents varietal information (i.e. 
    what type of wine is this, where did it originate from...)

*/
class VarietalCompositionEntry{
    BigInt percentage;
    Variety variety;
    Vineyard vineyard;
}

/**

    VarietalCompressionServiceImpl

    'sender' role in the 'chain of responsibility' pattern. Basically establishes an outer loop
    that works from the smallest percentage upwards in order to delegate the task of condensing 
    pieces of information into more generalized groups in order to meet an overall maximum record count threshold, in the least destructive manner.
*/
public class VarietalCompressionServiceImpl{

    public List<VarietalCompositionEntry> ensureMaxEntryLogicApplied(List<VarietalCompositionEntry> entries){

        // So this is the max number of entries....
        public static final MAX_ENTRY_COUNT = 200;

        // We define the amount we incrementally attempt to apply rules towards 
        final BigDecimal incrementAmount = .0000000001;

        // Ensure we only apply logic if ncessary
        if(entries.size()<=MAX_ENTRY_COUNT){
            return entries;
        }

        // Determine the smallest percentage we apply based on the min percent value present in the 
        // set of records
        BigDecimal minPct = ...

        // Let's configure a series of rules that will actuall do the work...
        Rule rule1 = new CompressToNapaRegions();
        Rule rule2 = new CompressToMixedRed();
        Rule rule3 = new CompressToCaliforniaVarietal();

        rule1.setNextRule(rule2);
        rule2.setNextRule(rule3)

        /**
            Main looping routine:

            So we call the first rule in the chain, pass in the entries we are attempting to 
            reduce, in addition to a threshold. A small deviation from a more simple implementation 
            of this pattern in the sense that we still delegate the work to the 'chain' however 
            we perform this in a loop, ever so slightly incrementing the criteria for which entriesbased on percentage become eligible for the logic.
        */
        for(x=minPct;x<100;x+incrementAmount){
            entries = rule1.applyRule(entries,x);
            if(entries.size()<=MAX_ENTRY_COUNT){
                return entries;
            }
        }

        return entries;
    }
}

/**
    Rule

        Interface responsible for defining common behavior for all classes responsible for 
        performing actions related to attempts to 
*/
public interface Rule{
    public List<VarietalCompositionEntry>entries applyRule(List<VarietalCompositionEntry>entries, threshold);
    public void setNextRule(Rule rule);
}

public abstract class extends AbstractRule{
    protected Rule nextRule;
}

/**

*/
public class CompressToCaliforniaVarietal implements Rule extends AbstractRule{

    List<VarietalCompositionEntry>entries(List<VarietalCompositionEntry>entries, threshold){
        /* So here we would apply logic in an attempt to reduce entries. The actual logic is not 
         important for this excersize, the important take away is that this rule applies
         logic that is conditionally applied based on whatever factors that come into play.
         Ideally, the logic would immediately return the modified/reduced set of records once 
         the mas record count threshold is met. Otherwise, it delegates additional processing 
         to other rules (should a 'next' rule be defined).
         */

    }

    void setNextRule(Rule rule){
        nextRule = rule;
    }

}

/**

*/
public class CompressToMixedRed extends AbstractRule{

}

/**

*/
public class CompressToNapaRegions extends AbstractRule{

}
[/code]

        

## Conclusion

        

          Apologies up front for any unintended transgretions into the domain
          project, my intent was to give the proper level of background to
          support a real world example. My goal was to apply a concrete
          implementation of a design pattern, in this case the 'chain of
          responsibility' pattern. I personally don't feel that there
          is enough real world examples of applied usage of these, a lot has to
          do with IP (totally get it).
        

        

          Design patterns are a powerful tool in a software engineers toolbox.
          Understanding them, and more importantly, understanding when and how
          to apply them is a skill that takes time to develop. I hope this
          article has provided some insight into a real world application of the
          chain of responsibility pattern.
        

        

          There are numerous potential approaches towards this particular
          problem, however by applying the appropriate pattern we align with a
          more consistent, best practice based approach.
        

        

          This approach might appear to be overkill, however in the actual
          implementation, the level of complexity and numerous rules made this a
          very practical approach. From a business perspective, the rules are
          subject to change, and new ones may be added over time. By applying
          this pattern, we set ourselves up for easier maintenance and
          scalability in the future. A very common scenario is one where where
          something is ' built ' and a seemingly simple request for a
          change comes along, which is percieved as a small change. In reality,
          when dealing with software that is not optimally designed, even a
          small change can have far reaching implications, and can result in a
          significant amount of rework. By applying design patterns, we can
          mitigate some of these risks, and make our software more adaptable to
          change.
        

        

          It's fairly easy to get lost in a world of day to day coding,
          implementing boilerplate logic such as servicing CRUD operations, etc.
          I would encourage everyone to take a step back from time to time, and
          think about the bigger picture, the architecture, and how design
          patterns can be applied to create more maintainable, testable, and
          scalable solutions. There is a difference between writing code to
          support a service and perhaps writing the source that actually is
          behind the application server that powers the service. Dig deeper...
          challenge yourself!
        

        

Recommended links

        

          * [
              https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/
            ](https://softwarepatternslexicon.com/mastering-design-patterns/behavioral-design-patterns/chain-of-responsibility-pattern/)
