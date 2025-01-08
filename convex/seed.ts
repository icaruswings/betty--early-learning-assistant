import { v } from "convex/values";
import { mutation } from "./_generated/server";

type SeedData = {
  conversations: {
    userId: string;
    title: string;
    createdAt: number;
    updatedAt: number;
  }[];
  messages: {
    role: "user" | "assistant";
    content: string;
    createdAt: number;
    conversationIndex: number;
  }[];
};

const seedData: SeedData = {
  conversations: [
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "Supporting Social-Emotional Development",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "Creating Inclusive Learning Environments",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "STEM Activities for Preschoolers",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "Behavior Management Strategies",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "Supporting Multilingual Learners",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
    {
      userId: "user_2qw5LclVm4086XTUhr8ACKU1Yxw",
      title: "Outdoor Learning Environments",
      createdAt: 1735485558000,
      updatedAt: 1735485558000,
    },
  ],
  messages: [
    // Conversation 0: Supporting Social-Emotional Development
    {
      role: "user",
      content:
        "I have a 3-year-old in my class who's having trouble sharing toys. What strategies would you recommend?",
      createdAt: 1735485558000,
      conversationIndex: 0,
    },
    {
      role: "assistant",
      content:
        'Here are some effective strategies for teaching sharing:\n\n1. Model Turn-Taking:\n- Use a visual timer for toy-sharing\n- Practice phrases like "May I have a turn when you\'re done?"\n- Celebrate successful sharing moments\n\n2. Create Sharing Opportunities:\n- Set up cooperative play stations\n- Have duplicate popular toys available\n- Use puppet play to demonstrate sharing scenarios\n\n3. Acknowledge Feelings:\n- "I see you\'re not ready to share yet"\n- "It\'s hard to wait for your turn"\n- Validate emotions while maintaining boundaries',
      createdAt: 1735485558000,
      conversationIndex: 0,
    },
    {
      role: "user",
      content:
        "Those are great suggestions. How can I involve parents in reinforcing these sharing behaviors?",
      createdAt: 1735485558000,
      conversationIndex: 0,
    },

    // Conversation 1: Creating Inclusive Learning Environments
    {
      role: "user",
      content:
        "I'm working on making our classroom more inclusive for a child with autism. Any suggestions for environmental modifications?",
      createdAt: 1735485558000,
      conversationIndex: 1,
    },
    {
      role: "assistant",
      content:
        "Creating an autism-friendly environment involves thoughtful organization:\n\n1. Physical Space:\n- Create clear visual boundaries\n- Set up a quiet corner\n- Reduce visual clutter\n- Establish predictable paths\n\n2. Visual Supports:\n- Picture schedules\n- Visual labels\n- Choice boards\n- First-Then boards\n\n3. Sensory Considerations:\n- Adjust lighting\n- Provide noise-reducing headphones\n- Offer sensory tools\n- Create varied sensory spaces",
      createdAt: 1735485558000,
      conversationIndex: 1,
    },

    // Conversation 2: STEM Activities
    {
      role: "user",
      content: "What are some engaging STEM activities for 4-5 year olds?",
      createdAt: 1735485558000,
      conversationIndex: 2,
    },
    {
      role: "assistant",
      content:
        "Here are some age-appropriate STEM activities:\n\n1. Simple Experiments:\n- Sink or float predictions\n- Color mixing\n- Plant growth observation\n\n2. Building Challenges:\n- Block tower challenges\n- Bridge building\n- Simple machines exploration\n\n3. Math Integration:\n- Pattern creation\n- Counting games\n- Shape hunts\n- Measurement activities",
      createdAt: 1735485558000,
      conversationIndex: 2,
    },
    {
      role: "user",
      content: "Could you elaborate on the simple machines exploration?",
      createdAt: 1735485558000,
      conversationIndex: 2,
    },
    {
      role: "assistant",
      content:
        "Here's how to explore simple machines:\n\n1. Ramps and Inclines:\n- Test different slopes\n- Compare rolling objects\n- Measure distances\n\n2. Levers:\n- Seesaw experiments\n- Balance scales\n- Fulcrum exploration\n\n3. Pulleys:\n- Simple pulley systems\n- Lifting experiments\n- Weight comparisons",
      createdAt: 1735485558000,
      conversationIndex: 2,
    },

    // Conversation 3: Behavior Management
    {
      role: "user",
      content:
        "How do you handle transitions between activities? They're often challenging for my group.",
      createdAt: 1735485558000,
      conversationIndex: 3,
    },
    {
      role: "assistant",
      content:
        "Smooth transitions require planning:\n\n1. Preparation:\n- Give time warnings\n- Use transition signals\n- Have visual schedules\n\n2. Engagement:\n- Use transition songs\n- Make it playful\n- Assign helper roles\n\n3. Consistency:\n- Establish routines\n- Practice transitions\n- Celebrate successes",
      createdAt: 1735485558000,
      conversationIndex: 3,
    },
    {
      role: "user",
      content: "What are some effective transition songs you'd recommend?",
      createdAt: 1735485558000,
      conversationIndex: 3,
    },

    // Conversation 4: Multilingual Learners
    {
      role: "user",
      content:
        "What strategies can I use to support children who speak different languages at home?",
      createdAt: 1735485558000,
      conversationIndex: 4,
    },
    {
      role: "assistant",
      content:
        "Supporting multilingual learners involves multiple approaches:\n\n1. Classroom Environment:\n- Label items in multiple languages\n- Display diverse cultural materials\n- Include multilingual books\n\n2. Teaching Strategies:\n- Use visual cues\n- Incorporate songs from different cultures\n- Allow code-switching\n\n3. Family Engagement:\n- Learn key words in home languages\n- Invite families to share stories\n- Create dual-language materials",
      createdAt: 1735485558000,
      conversationIndex: 4,
    },
    {
      role: "user",
      content: "How can I help other children understand and appreciate language differences?",
      createdAt: 1735485558000,
      conversationIndex: 4,
    },
    {
      role: "assistant",
      content:
        "Foster language appreciation through:\n\n1. Cultural Celebrations:\n- Share greetings in different languages\n- Explore cultural traditions\n- Learn simple songs\n\n2. Inclusive Activities:\n- Language of the week\n- Multicultural story time\n- International food exploration\n\n3. Peer Connections:\n- Buddy systems\n- Collaborative projects\n- Cultural share days",
      createdAt: 1735485558000,
      conversationIndex: 4,
    },

    // Conversation 5: Outdoor Learning
    {
      role: "user",
      content: "How can I create more learning opportunities in our outdoor space?",
      createdAt: 1735485558000,
      conversationIndex: 5,
    },
    {
      role: "assistant",
      content:
        "Transform your outdoor space with these elements:\n\n1. Nature Exploration:\n- Garden areas\n- Bug observation stations\n- Weather monitoring\n\n2. Active Learning:\n- Balance beams\n- Climbing challenges\n- Movement games\n\n3. Creative Spaces:\n- Outdoor art station\n- Music wall\n- Dramatic play area",
      createdAt: 1735485558000,
      conversationIndex: 5,
    },
  ],
};

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const userId = identity.subject;

    // Insert conversations
    const conversationIds = await Promise.all(
      seedData.conversations.map(async (conversation) => {
        return await ctx.db.insert("conversations", {
          userId: conversation.userId,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        });
      })
    );

    // Create messages and associate them with conversations
    await Promise.all(
      seedData.messages.map(async (message) => {
        const { conversationIndex, ...messageData } = message;
        return await ctx.db.insert("messages", {
          conversationId: conversationIds[conversationIndex],
          role: messageData.role,
          content: messageData.content,
          createdAt: messageData.createdAt,
        });
      })
    );

    return {
      success: true,
      message: "Seed data loaded successfully",
    };
  },
});
