<template>
  <div
    class="page-message-friend bg-white box-border rounded box-show mt-3 d-none"
  >
    <div
      class="d-flex message-title border-bottom golfer-border justify-content-between"
    >
      <h2 class="text-black text-weight m-0">Friends</h2>
      <p class="m-0 color-primary golfer-cursor">View all</p>
    </div>

    <div class="message-box d-flex justify-content-between align-items-center">
      <p class="m-0">
        Kiandra Lowe<i class="icon icon-circle d-inline-block ml-2"></i>
      </p>
      <div>
        <el-tooltip
          effect="dark"
          content="Can see your reservations"
          placement="bottom"
        >
          <button
            type="button"
            class="btn btn-outline-success p-0 icon-friend-bg mr-2"
          >
            <i class="far fa-check icon"></i>
          </button>
        </el-tooltip>

        <el-tooltip
          effect="dark"
          content="Can close your reservation"
          placement="bottom"
        >
          <button
            type="button"
            class="btn btn-outline-danger p-0 icon-friend-bg"
          >
            <i class="far fa-times icon"></i>
          </button>
        </el-tooltip>
      </div>
    </div>

    <div class="message-box d-flex justify-content-between align-items-center">
      <p class="m-0">
        Chikanso Chima<i class="icon icon-circle d-inline-block ml-2"></i>
      </p>
      <div>
        <button
          type="button"
          class="btn btn-outline-success p-0 icon-friend-bg mr-2"
        >
          <i class="far fa-check icon"></i>
        </button>
        <button type="button" class="btn btn-outline-danger p-0 icon-friend-bg">
          <i class="far fa-times icon"></i>
        </button>
      </div>
    </div>

    <div class="message-box d-flex justify-content-between align-items-center">
      <p class="m-0">Maria Trofimova</p>
      <div>
        <button
          type="button"
          class="btn btn-outline-success p-0 icon-friend-bg mr-2"
        >
          <i class="far fa-check icon"></i>
        </button>
        <button type="button" class="btn btn-outline-danger p-0 icon-friend-bg">
          <i class="far fa-times icon"></i>
        </button>
      </div>
    </div>

    <div class="message-box">
      <p class="m-0 color-primary golfer-cursor" @click="dialogVisible = true">
        <i class="far fa-plus icon mr-2"></i>Add a new friend
      </p>
      <el-dialog title="Add a friend" v-model.propname="dialogVisible">
        <p class="text-weight text-black mb-1">
          Add a friend by name or email address
        </p>

        <el-input
          placeholder="Type to start a search..."
          @input="handleChange"
          v-model="state"
        >
          <i :class="iconSuffix"></i>
        </el-input>

        <p class="mt-3 mb-0 color-sub-title" v-show="foundVisible === true">
          Nothing found yet...
        </p>
        <div v-show="foundVisible === false" class="foundUsers mt-3">
          <p class="text-weight text-black mb-1">
            Found users ({{ foundData.length }})
          </p>
          <ul class="p-0 m-0">
            <li v-if="registerVisible === false">
              <div
                class="d-flex justify-content-between align-items-center div-found"
                v-for="(item, index) in foundData"
                :key="index"
              >
                <span class="text-black">{{
                  item.email === ""
                    ? item.value + " (not registered)"
                    : item.value + " (" + item.email + ")"
                }}</span>
                <button type="button" class="btn btn-outline-primary">
                  {{ item.email === "" ? "Send invite" : "Send request" }}
                </button>
              </div>
            </li>

            <li
              v-else
              class="d-flex justify-content-between align-items-center"
            >
              <span class="text-black">The user was not registered</span>
              <button
                type="button"
                class="btn btn-outline-danger ml-2"
                @click="onInvite"
              >
                Send invite
              </button>
            </li>
          </ul>
        </div>
        <button
          v-show="emailVisible === true"
          type="button"
          class="btn btn-primary w-100 mt-2"
        >
          <i class="far fa-user-plus icon mr-2"></i>Send friend request
        </button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerVisible: false,
      foundData: [],
      emailVisible: false,
      iconSuffix: "far fa-search icon",
      foundVisible: true,
      dialogVisible: false,
      state: "",
      timeout: null,
      form: [
        {
          value: "aaaa",
          email: "LusA@qq.com",
        },
        {
          value: "aaaabbbbb",
          email: "123@qq.com",
        },
        {
          value: "bbbb",
          email: "",
        },
        {
          value: "cccc",
          email: "LusC@qq.com",
        },
        {
          value: "dddd",
          email: "ddd@qq.com",
        },
        {
          value: "aabb",
          email: "aabb@qq.com",
        },
      ],
    };
  },
  methods: {
    handleChange() {
      this.foundVisible = this.state === "";

      // if (this.state.indexOf('@') !== -1) {
      //   this.iconSuffix = 'far fa-envelope icon';
      //   this.emailVisible = true;
      // } else {
      //   this.iconSuffix = 'far fa-search icon';
      //   this.emailVisible = false;
      // }
      this.foundData = this.form.filter((item) => {
        if (this.state !== "" && this.state.length >= 3) {
          return (
            item.value.toLowerCase().indexOf(this.state) >= 0 ||
            item.email.toLowerCase().indexOf(this.state) >= 0
          );
        }
      });
      if (this.state.length >= 3) {
        this.foundData.length < 1
          ? (this.registerVisible = true)
          : (this.registerVisible = false);
      }
    },
    onInvite() {
      if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.state)) {
        this.$message({
          message: "The user was not found!",
          type: "warning",
        });
      } else {
        this.$confirm("Are you sure?", "Invite prompt ", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "Sent successfully!",
            });
            // this.$router.push('sign-up' + '?email=' + this.state);
          })
          .catch(() => {});
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "../css/_variables";

.page-message-friend {
  .message-title {
    padding: 1.2rem 1rem;

    h2 {
      font-size: 1rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  .icon-circle {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #cbe0f7;
    border-radius: 0.5rem;
  }

  .icon-friend-bg {
    width: 1.5rem;
    height: 1.5rem;
    background-color: #ccf7e5;
    border: none;
  }

  .message-box {
    font-size: 0.9rem;
    padding: 1rem;
    border-bottom: 1px solid $border;
  }

  .foundUsers {
    ul {
      list-style: none;

      li {
        .div-found {
          cursor: pointer;
          padding-top: 0.6rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid rgba(155, 155, 155, 0.25);

          &:last-of-type {
            border-bottom: none;
          }

          &:hover {
            span {
              font-weight: 600;
            }
          }
        }

        button {
          width: 6.5rem;
          height: 2rem;
          font-size: 0.8rem;
          padding: 0;

          &:hover {
            color: #fff;
            background-color: $success;
            border: solid 1px $success;
            box-shadow: 0 0.5px 0.5px 0 rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }

  .el-dialog {
    width: 30%;
  }

  .el-autocomplete {
    width: 100%;
  }

  .el-input__suffix {
    line-height: 2.6rem;
    right: 0.8rem;
  }

  .el-tooltip__popper.is-dark {
    padding: 0.4rem;
  }

  @media screen and (max-width: 992px) {
    .el-dialog {
      width: 50%;
    }
  }
  @media screen and (max-width: 576px) {
    .el-dialog {
      width: 80%;
    }
  }
}
</style>
